pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'trong19/ytt_fe'
        DOCKER_TAG = 'latest'
        PROD_SERVER_PORT = credentials('PROD_SERVER_PORT')
        PROD_SERVER_NAME = credentials('PROD_SERVER_NAME')
        PROD_USER = credentials('PROD_USER')
        PROD_PASSWORD = credentials('PROD_PASSWORD')
        TELEGRAM_BOT_TOKEN = credentials('TELEGRAM_BOT_TOKEN')
        TELEGRAM_CHAT_ID = credentials('TELEGRAM_CHAT_ID')
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/TrongPham1920/youtube_litte_fe.git'
            }
        }

        stage('Prepare Config') {
            steps {
                withCredentials([file(credentialsId: 'config_file', variable: 'CONFIG_FILE')]) {
                    sh 'mkdir -p $WORKSPACE/config'
                    sh 'cp $CONFIG_FILE $WORKSPACE/config'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker image for linux/amd64 platform...'
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}", "--platform linux/amd64 .")
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Production on Acer Archlinux server') {
            steps {
                script {
                    echo 'Deploying to Production...'

                    sh '''
                        echo 'Stopping and removing existing container...'
                        sshpass -p "${PROD_PASSWORD}" ssh -o StrictHostKeyChecking=no -p "${PROD_SERVER_PORT}" "${PROD_USER}"@${PROD_SERVER_NAME} "
                            docker stop yourvibes_api_server || echo 'Container not running' && \
                            docker rm yourvibes_api_server || echo 'Container not found'
                        "
                    '''

                }
            }
        }
    }

    post {
        success {
            cleanWs()
            sendTelegramMessage("✅ Build #${BUILD_NUMBER} was successful! ✅")
        }

        failure {
            cleanWs()
            sendTelegramMessage("❌ Build #${BUILD_NUMBER} failed. ❌")
        }
    }
}

def sendTelegramMessage(String message) {
    withEnv(["MESSAGE=${message}"]) {
        sh '''
        curl -s -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage \
        -d chat_id=$TELEGRAM_CHAT_ID \
        -d text="$MESSAGE"
        '''
    }
}
