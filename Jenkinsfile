#!groovy
@Library('waluigi@v5.0.0') _

standardProperties()

node("primary") {
  echo "Clean workspace"
  cleanWs()

  stage("checkout") {
    checkout localBranch(scm)
  }

  stage("dependencies") {
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
      sh "yarn beehive-flow publish --working-dir dist/tinymce-angular"
      sh "yarn beehive-flow advance-ci"
    }
  }
}
