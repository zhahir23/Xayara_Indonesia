const pool = require('../config/database');
require('dotenv').config();

// Initialize Brevo client
let apiInstance = null;

if (process.env.BREVO_API_KEY) {
  try {
    const SibApiV3Sdk = require('sib-api-v3-sdk');
    
    // Create API instance
    apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    
    // Set API key using the proper method
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    
    console.log('Brevo API initialized');
  } catch (error) {
    console.error('Error initializing Brevo API:', error.message);
    console.log('Brevo API not configured');
  }
} else {
  console.log('Brevo API not configured');
}

// Create email broadcast
exports.createBroadcast = async (req, res) => {
  try {
    const { subject, content } = req.body;
    const sentBy = req.user?.name || 'Admin';

    if (!subject || !content) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }

    // Get all unique email addresses from reservations (deduplicated)
    const emailResult = await pool.query(
      'SELECT DISTINCT email, nama FROM reservations WHERE email IS NOT NULL AND email != \'\''
    );

    const recipients = emailResult.rows;
    const totalRecipients = recipients.length;

    if (totalRecipients === 0) {
      return res.status(400).json({ message: 'No recipients found' });
    }

    // Create broadcast record
    const broadcastResult = await pool.query(
      'INSERT INTO email_broadcasts (subject, content, status, total_recipients, sent_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [subject, content, 'pending', totalRecipients, sentBy]
    );

    const broadcast = broadcastResult.rows[0];

    // Insert recipients into email_broadcast_recipients table
    for (const recipient of recipients) {
      await pool.query(
        'INSERT INTO email_broadcast_recipients (broadcast_id, email, nama, status) VALUES ($1, $2, $3, $4) ON CONFLICT (broadcast_id, email) DO NOTHING',
        [broadcast.id, recipient.email, recipient.nama, 'pending']
      );
    }

    // Start sending emails asynchronously
    sendBroadcastEmails(broadcast.id, recipients, subject, content).catch(err => {
      console.error('Error in broadcast:', err);
    });

    res.status(201).json({
      message: 'Email broadcast created successfully',
      broadcast: {
        id: broadcast.id,
        subject: broadcast.subject,
        status: broadcast.status,
        totalRecipients: broadcast.total_recipients,
        createdAt: broadcast.created_at
      }
    });
  } catch (error) {
    console.error('Error creating broadcast:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send broadcast emails
async function sendBroadcastEmails(broadcastId, recipients, subject, content) {
  try {
    // Update status to sending
    await pool.query(
      'UPDATE email_broadcasts SET status = $1 WHERE id = $2',
      ['sending', broadcastId]
    );

    let sentCount = 0;
    let failedCount = 0;

    if (!apiInstance) {
      console.log('Brevo API not configured, skipping actual email sending');
      // Update as if all sent for testing
      await pool.query(
        `UPDATE email_broadcasts 
         SET status = 'completed', sent_count = $1, failed_count = $2, completed_at = NOW()
         WHERE id = $3`,
        [recipients.length, 0, broadcastId]
      );
      return;
    }

    // Send emails in batches
    for (const recipient of recipients) {
      try {
        const SibApiV3Sdk = require('sib-api-v3-sdk');
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.textContent = content;
        sendSmtpEmail.sender = {
          name: process.env.BREVO_SENDER_NAME || 'Xayara Indonesia',
          email: process.env.BREVO_SENDER_EMAIL || 'noreply@xayaraindonesia.com'
        };
        sendSmtpEmail.to = [{ email: recipient.email, name: recipient.nama }];
        
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        sentCount++;
        
        // Update recipient status to sent
        await pool.query(
          'UPDATE email_broadcast_recipients SET status = $1, message_id = $2, sent_at = NOW() WHERE broadcast_id = $3 AND email = $4',
          ['sent', result.messageId || null, broadcastId, recipient.email]
        );
        
        console.log(`✅ Email sent to ${recipient.email}. Message ID: ${result.messageId || 'N/A'}`);
      } catch (error) {
        failedCount++;
        
        // Update recipient status to failed
        await pool.query(
          'UPDATE email_broadcast_recipients SET status = $1, error_message = $2 WHERE broadcast_id = $3 AND email = $4',
          ['failed', error.message, broadcastId, recipient.email]
        );
        
        console.error(`❌ Failed to send email to ${recipient.email}:`, error.message);
        if (error.response) {
          console.error(`Response body:`, JSON.stringify(error.response.body, null, 2));
        }
      }
    }

    // Update broadcast status to completed and update counts
    await pool.query(
      `UPDATE email_broadcasts 
       SET status = 'completed', sent_count = $1, failed_count = $2, completed_at = NOW()
       WHERE id = $3`,
      [sentCount, failedCount, broadcastId]
    );

    console.log(`📧 Broadcast ${broadcastId} completed: ${sentCount} sent, ${failedCount} failed`);
  } catch (error) {
    console.error('Error sending broadcast emails:', error);
    // Even if there's an error, update counts and mark as completed
    await pool.query(
      `UPDATE email_broadcasts 
       SET status = 'completed', sent_count = $1, failed_count = $2, completed_at = NOW()
       WHERE id = $3`,
      [sentCount, failedCount, broadcastId]
    );
  }
}

// Get all broadcasts
exports.getAllBroadcasts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, subject, status, total_recipients, sent_count, failed_count, 
              sent_by, created_at, updated_at, completed_at
       FROM email_broadcasts
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting broadcasts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get broadcast by ID
exports.getBroadcastById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM email_broadcasts WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Broadcast not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting broadcast:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get broadcast status
exports.getBroadcastStatus = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, subject, status, total_recipients, sent_count, failed_count, 
              sent_by, created_at, completed_at
       FROM email_broadcasts
       ORDER BY created_at DESC
       LIMIT 10`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error getting broadcast status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete broadcast
exports.deleteBroadcast = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM email_broadcasts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Broadcast not found' });
    }

    res.json({ message: 'Broadcast deleted successfully' });
  } catch (error) {
    console.error('Error deleting broadcast:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get broadcast recipients
exports.getBroadcastRecipients = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    let query = 'SELECT * FROM email_broadcast_recipients WHERE broadcast_id = $1';
    const params = [id];

    if (status && ['pending', 'sent', 'failed'].includes(status)) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting broadcast recipients:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend failed emails
exports.resendFailedEmails = async (req, res) => {
  try {
    const { id } = req.params;

    // Get broadcast details
    const broadcastResult = await pool.query(
      'SELECT * FROM email_broadcasts WHERE id = $1',
      [id]
    );

    if (broadcastResult.rows.length === 0) {
      return res.status(404).json({ message: 'Broadcast not found' });
    }

    const broadcast = broadcastResult.rows[0];

    // Get failed recipients
    const failedRecipientsResult = await pool.query(
      'SELECT * FROM email_broadcast_recipients WHERE broadcast_id = $1 AND status = $2',
      [id, 'failed']
    );

    const failedRecipients = failedRecipientsResult.rows;

    if (failedRecipients.length === 0) {
      return res.status(400).json({ message: 'No failed emails to resend' });
    }

    // Start resending emails asynchronously
    resendFailedEmails(id, failedRecipients, broadcast.subject, broadcast.content).catch(err => {
      console.error('Error resending emails:', err);
    });

    res.json({
      message: `Resending ${failedRecipients.length} failed emails`,
      count: failedRecipients.length
    });
  } catch (error) {
    console.error('Error resending failed emails:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend failed emails function
async function resendFailedEmails(broadcastId, recipients, subject, content) {
  try {
    // Update broadcast status to sending
    await pool.query(
      'UPDATE email_broadcasts SET status = $1 WHERE id = $2',
      ['sending', broadcastId]
    );

    let sentCount = 0;
    let failedCount = 0;

    if (!apiInstance) {
      console.log('Brevo API not configured, skipping actual email sending');
      return;
    }

    for (const recipient of recipients) {
      try {
        const SibApiV3Sdk = require('sib-api-v3-sdk');
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.textContent = content;
        sendSmtpEmail.sender = {
          name: process.env.BREVO_SENDER_NAME || 'Xayara Indonesia',
          email: process.env.BREVO_SENDER_EMAIL || 'noreply@xayaraindonesia.com'
        };
        sendSmtpEmail.to = [{ email: recipient.email, name: recipient.nama }];
        
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
        
        // Update recipient status to sent
        await pool.query(
          'UPDATE email_broadcast_recipients SET status = $1, message_id = $2, sent_at = NOW(), error_message = NULL WHERE id = $3',
          ['sent', result.messageId || null, recipient.id]
        );
        
        sentCount++;
        console.log(`✅ Resent email to ${recipient.email}. Message ID: ${result.messageId || 'N/A'}`);
      } catch (error) {
        failedCount++;
        
        // Update recipient status to failed with new error
        await pool.query(
          'UPDATE email_broadcast_recipients SET status = $1, error_message = $2 WHERE id = $3',
          ['failed', error.message, recipient.id]
        );
        
        console.error(`❌ Failed to resend email to ${recipient.email}:`, error.message);
      }
    }

    // Update broadcast sent/failed counts
    const statsResult = await pool.query(
      'SELECT COUNT(*) FILTER (WHERE status = $1) as sent, COUNT(*) FILTER (WHERE status = $2) as failed FROM email_broadcast_recipients WHERE broadcast_id = $3',
      ['sent', 'failed', broadcastId]
    );

    const stats = statsResult.rows[0];

    await pool.query(
      'UPDATE email_broadcasts SET sent_count = $1, failed_count = $2, status = $3 WHERE id = $4',
      [stats.sent, stats.failed, stats.failed > 0 ? 'completed' : 'completed', broadcastId]
    );

    console.log(`📧 Resend completed for broadcast ${broadcastId}: ${sentCount} sent, ${failedCount} failed`);
  } catch (error) {
    console.error('Error resending failed emails:', error);
  }
}
