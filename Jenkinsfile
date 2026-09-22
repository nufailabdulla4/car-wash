pipeline{
    agent any
        stages{
            stage('Checkout'){
                steps{
                    deleteDir()
                    sh '''
                        git clone https://github.com/nufailabdulla4/car-wash.git
                        ls -l
                        '''
                        }
            }
            stage('Deploy'){
                steps{
                    sh '''
                    rm -rf /var/ww/html/*
                    cp -r car-wash/* /var/www/html
                    '''
                    
                }
            }
        }
    }
