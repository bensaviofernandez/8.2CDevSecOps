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
      // store the token in Jenkins as a “Secret text” credential called SONAR_TOKEN
      environment {
        SONAR_TOKEN = credentials('SONAR_TOKEN')      // <-- make sure this ID exists
        SONAR_SCANNER_VERSION = '7.0.2.4839'
      }
      steps {
        // one portable shell script
        sh '''
          set -e

          # Where we’ll cache the scanner inside the Jenkins agent’s $HOME
          export SCANNER_HOME="$HOME/.sonar/sonar-scanner-$SONAR_SCANNER_VERSION-linux-x64"

          # ─── Download & unzip once ──────────────────────────────────────────
          if [ ! -d "$SCANNER_HOME" ]; then
            mkdir -p "$HOME/.sonar"
            curl --create-dirs -sSLo "$HOME/.sonar/sonar-scanner.zip" \
              "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-$SONAR_SCANNER_VERSION-linux-x64.zip"
            unzip -o -qq "$HOME/.sonar/sonar-scanner.zip" -d "$HOME/.sonar/"
          fi

          # ─── Put scanner on PATH ───────────────────────────────────────────
          export PATH="$SCANNER_HOME/bin:$PATH"
          export SONAR_SCANNER_OPTS="-server"

          # ─── Run analysis ──────────────────────────────────────────────────
          sonar-scanner \
            -Dsonar.host.url=https://sonarcloud.io \
            -Dsonar.organization=bensaviofernandez \
            -Dsonar.projectKey=bensaviofernandez_8.2CDevSecOps \
            -Dsonar.token="$SONAR_TOKEN" \
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
