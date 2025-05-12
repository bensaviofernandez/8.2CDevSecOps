pipeline {
  agent any

  /* Node 18 tool that you configured in Jenkins → Global Tools */
  tools { nodejs 'Node18' }

  /* Expose the personal token you generated on SonarCloud (My Account ▸ Security) */
  environment {
    SONAR_TOKEN = credentials('SONAR_TOKEN')      // secret‑text credential
  }

  stages {

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { sh 'npm ci' }
    }

    stage('Unit & Coverage Tests') {
      steps { sh 'npm test -- --coverage --passWithNoTests' }
      post { always { archiveArtifacts artifacts: 'coverage/**', fingerprint: true } }
    }

    stage('SonarCloud Analysis') {
      environment { SONAR_TOKEN = credentials('SONAR_TOKEN') }
      steps {
        sh '''
          set -e
          SCANNER_DIR=sonar-scanner-4.8.0.2856-linux

          if [ ! -d "$SCANNER_DIR" ]; then
            curl -sSLo sonar-scanner.zip \
                https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/${SCANNER_DIR}.zip
            unzip -o -qq sonar-scanner.zip
          fi

          /usr/lib/jvm/java-17-openjdk-amd64/bin/java -jar \
            $SCANNER_DIR/lib/sonar-scanner-cli-4.8.0.2856.jar \
            -Dscanner.home=$SCANNER_DIR \
            -Dproject.settings=sonar-project.properties \
            -Dsonar.host.url=https://sonarcloud.io \
            -Dsonar.organization=bensaviofernandez-1 \
            -Dsonar.projectKey=bensaviofernandez_8.2CDevSecOps \
            -Dsonar.token=$SONAR_TOKEN \
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
