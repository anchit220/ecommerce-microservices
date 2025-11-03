pipeline {
    agent any

    environment {
        DOCKER_HUB = "anchitpatil"
        DOCKER_CREDS = credentials('dockerhub-credentials')
        KUBE_CREDS = credentials('kubeconfig')
    }

    stages {
        stage('Build & Push Images') {
            parallel {
                stage('Auth Service') {
                    steps {
                        dir('auth-service') {
                            sh '''
                            docker build -t $DOCKER_HUB/auth-service:latest .
                            echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin
                            docker push $DOCKER_HUB/auth-service:latest
                            '''
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh '''
                            docker build -t $DOCKER_HUB/frontend:latest .
                            echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin
                            docker push $DOCKER_HUB/frontend:latest
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'kubeconfig']) {
                    sh '''
                    kubectl apply -f k8s/
                    kubectl get pods
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Build Failed!'
        }
    }
}
