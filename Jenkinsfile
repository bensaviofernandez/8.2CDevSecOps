pipeline {
  agent any
  tools {
    nodejs 'Node18'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install') {
      steps { sh 'npm ci' }
    }
    stage('Unit & Coverage Tests') {
      steps { sh 'npm test -- --coverage --passWithNoTests' }
      post { always { archiveArtifacts artifacts: 'coverage/**', fingerprint: true } }
    }
    stage('SonarCloud Analysis') {
      environment {
        SONAR_TOKEN = credentials('SONAR_TOKEN')
      }
      steps {
        sh '''
          # download scanner
          curl -sSLo sonar-scanner.zip \
            https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip

          # blow away any previous extract
          rm -rf sonar-scanner-4.8.0.2856-linux

          # unzip quietly and overwrite if needed
          unzip -o -qq sonar-scanner.zip

          # 👉 Force wrapper to use the embedded JRE17
          export JAVA_HOME=$PWD/sonar-scanner-4.8.0.2856-linux/jre
          export PATH=$JAVA_HOME/bin:$PATH

          # run scanner
          ./sonar-scanner-*/bin/sonar-scanner \
            -Dsonar.host.url=https://sonarcloud.io \
            -Dsonar.login=$SONAR_TOKEN \
            -Dsonar.organization=bensaviofernandez \
            -Dsonar.projectKey=bensaviofernandez_8.2CDevSecOps \
            -Dsonar.sources=. \
            -Dsonar.exclusions=node_modules/** \
            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
        '''
      }
      
    }


    stage('Security Audit') {
      steps { sh 'npm audit --json > audit.json || true' }
      post { always { archiveArtifacts artifacts: 'audit.json', fingerprint: true } }
    }
  }
}
