pipeline {
    agent any

    environment {
        APP_DIR = "/opt/express-cicd"
        SERVICE_NAME = "express-cicd.service"
        APP_PORT = "3000"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out latest Express application code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Express dependencies...'

                sh '''
                    npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running Express automated tests...'

                sh '''
                    npm test
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying Express application...'

                sh '''
                    mkdir -p "$APP_DIR"

                    rsync -a --delete \
                        --exclude='.git' \
                        --exclude='node_modules' \
                        ./ "$APP_DIR"/

                    cd "$APP_DIR"

                    npm ci --omit=dev
                '''
            }
        }

        stage('Restart Service') {
            steps {
                echo 'Restarting Express systemd service...'

                sh '''
                    sudo systemctl restart "$SERVICE_NAME"
                    sudo systemctl is-active --quiet "$SERVICE_NAME"
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking Express application health...'

                sh '''
                    sleep 3

                    curl --fail --silent --show-error \
                        http://127.0.0.1:${APP_PORT}/health
                '''
            }
        }
    }

    post {
        success {
            echo 'Express CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'Express CI/CD pipeline failed. Check the Jenkins console output.'
        }

        always {
            echo 'Express CI/CD pipeline execution finished.'
        }
    }
}
