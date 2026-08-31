/*
 * Xayara Indonesia - CI/CD Pipeline
 *
 * Environment variables (ubah di bagian environment di bawah):
 *   DEPLOY_TARGET  = 'local' (testing) | 'vps' (production)
 *   IMAGE_NAME     = Nama Docker image yang akan di-build
 *   VPS_HOST dkk   = Diabaikan saat DEPLOY_TARGET='local'
 */

def APP_DIR = '/workspace/xayara'

pipeline {
    agent any

    environment {
        DEPLOY_TARGET      = 'local'
        IMAGE_NAME         = 'xayara-indonesia-app'

        VPS_HOST           = ''
        VPS_DEPLOY_PATH    = '/opt/xayara'
        SSH_CREDENTIALS_ID = ''
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    if (env.DEPLOY_TARGET == 'local') {
                        dir(APP_DIR) {
                            echo "Source: ${pwd()}"
                            sh 'ls -la'
                        }
                    } else {
                        checkout scm
                    }
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Client') {
                    steps {
                        dir("${APP_DIR}/client") {
                            sh 'npm install'
                        }
                    }
                }
                stage('Server') {
                    steps {
                        dir("${APP_DIR}/server") {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${APP_DIR}/client") {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir(APP_DIR) {
                    sh 'docker build -t ${IMAGE_NAME}:latest .'
                }
            }
        }

        stage('Deploy Local') {
            when {
                expression { DEPLOY_TARGET == 'local' }
            }
            steps {
                dir(APP_DIR) {
                    sh 'docker compose up -d --build'
                }
            }
        }

        stage('Deploy VPS') {
            when {
                expression { DEPLOY_TARGET == 'vps' }
            }
            steps {
                sshagent(credentials: env.SSH_CREDENTIALS_ID) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${VPS_HOST} '
                            cd ${VPS_DEPLOY_PATH} &&
                            git pull origin main &&
                            docker compose up -d --build
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline selesai. DEPLOY_TARGET=${env.DEPLOY_TARGET}"
        }
        success {
            echo 'Pipeline BERHASIL!'
        }
        failure {
            echo 'Pipeline GAGAL! Periksa log di atas.'
        }
    }
}
