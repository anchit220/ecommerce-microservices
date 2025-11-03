pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/anchit220/ecommerce-microservices.git'
            }
        }

        stage('Build & Push Images') {
            parallel {
                stage('Auth Service') {
                    steps {
                        dir('auth-service') {
                            sh '''
                            docker build -t anchitpatil/auth-service:latest .
                            docker push anchitpatil/auth-service:latest
                            '''
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                            docker build -t anchitpatil/frontend:latest .
                            docker push anchitpatil/frontend:latest
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f k8s/
                '''
            }
        }
    }
}
