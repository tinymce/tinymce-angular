#!groovy
@Library('waluigi@v5.0.0') _

standardProperties()

def addGitHubToKnownHosts() {
  // GitHub meta information:
  // https://docs.github.com/en/rest/meta#get-github-meta-information
  // https://github.blog/changelog/2022-01-18-githubs-ssh-host-keys-are-now-published-in-the-api/
  String ghMetaJson = sh returnStdout: true,
    script: "curl -s https://api.github.com/meta"
  def ghMeta = readJSON text: ghMetaJson
  // Ensure user SSH config directory exists
  sh 'mkdir ~/.ssh && chmod go-rwx ~/.ssh'
  // Populate keys GitHub SSH host keys
  for (hostKey in ghMeta.ssh_keys) {
    sh "echo '$hostKey' >> ~/.ssh/known_hosts"
  }
}

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
  podTemplate(
    cloud: "builds",
    yaml: '''
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
            memory: "4Gi"
            cpu: "500m"
          limits:
            memory: "4Gi"
            cpu: "4"
    '''.stripIndent()
  ) {
    node(POD_LABEL) {
      container('jnlp') {
        stage("checkout") {
          checkout localBranch(scm)
        }
      }
      container('node') {
        stage("environment") {
          // Add github.com to known_hosts for publishing
          addGitHubToKnownHosts()
          // Check committer name / email are set
          sh "git var GIT_COMMITTER_IDENT"
        }

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
              // Build and publish storybook
              sh 'yarn storybook-to-ghpages'
            }
          } else {
            // Build storybook without publishing
            sh 'yarn storybook-to-ghpages --dry-run'
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
