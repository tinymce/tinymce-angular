#!groovy
@Library('waluigi@v5.0.0') _

standardProperties()

def withPublishCredentials(String dirPath, cl) {
  withCredentials([
    string(credentialsId: 'npm_live_token', variable: 'NPM_LIVE_TOKEN')
  ]) {
    String filePath = "${dirPath}/.npmrc"
    try {
      sh """
      cat > "${filePath}" <<EOF
      //registry.npmjs.org/:_authToken=${env.NPM_LIVE_TOKEN}
      EOF
      """.stripIndent()
      sh """
      cd "${dirPath}" && \
      npm whoami --registry https://registry.npmjs.org/
      """.stripIndent()
      cl()
    } finally {
      sh "rm \"${filePath}\""
    }
  }
}

timestamps {
  podTemplate(yaml: '''
    apiVersion: "v1"
    kind: "Pod"
    spec:
      securityContext:
        runAsUser: 1000
        runAsGroup: 1000
      containers:
      - name: "node"
        image: "public.ecr.aws/docker/library/node:18"
        command:
        - "sleep"
        args:
        - "infinity"
        imagePullPolicy: "Always"
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "2"
    '''.stripIndent()
  ) {
    node(POD_LABEL) {
      container('jnlp') {
        stage("checkout") {
          checkout localBranch(scm)
        }
      }
      container('node') {
        stage("dependencies") {
          sh 'yarn config set registry https://registry.npmjs.org/'
          yarnInstall()
        }

        stage("stamp") {
          sh "yarn beehive-flow stamp"
        }

        stage("build") {
          sh "yarn build"
        }

        stage("lint") {
          sh "yarn lint"
        }

        bedrockBrowsers(testDirs: [ "tinymce-angular-component/src/test/ts/browser" ])

        stage("storybook") {
          def status = beehiveFlowStatus();
          if (status.branchState == 'releaseReady' && status.isLatest) {
            sshagent (credentials: ['ccde5b3d-cf13-4d70-88cf-ae1e6dfd4ef4']) {
              sh 'yarn storybook-to-ghpages'
            }
          } else {
            echo "Skipping as is not latest release"
          }
        }

        stage("publish") {
          sshagent(credentials: ['jenkins2-github']) {
            withPublishCredentials('dist/tinymce-angular') {
              sh "yarn beehive-flow publish --working-dir dist/tinymce-angular"
            }
            sh "yarn beehive-flow advance-ci"
          }
        }
      }
    }
  }
}
