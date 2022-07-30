#!groovy
@Library('waluigi@feature/DEVOPS-449') _

beehiveFlowBuild(
    container: [ tag: '18', maxCpu: '4', minMemory: '4Gi', maxMemory: '4Gi' ],
    test: {
      bedrockBrowsers(testDirs: [ "tinymce-angular-component/src/test/ts/browser" ])
    },
    customSteps: {
      stage("storybook") {
        def status = beehiveFlowStatus();
        if (status.branchState == 'releaseReady' && status.isLatest) {
          sshagent (credentials: ['ccde5b3d-cf13-4d70-88cf-ae1e6dfd4ef4']) {
            sh 'yarn storybook-to-ghpages'
          }
        } else {
          echo "Skipping publish as is not latest release"
          sh 'yarn storybook-to-ghpages --dry-run'
        }
      }
    },
    publish: {
      tinyNpm.withNpmPublishCredentials('dist/tinymce-angular') {
        sh "yarn beehive-flow publish --working-dir dist/tinymce-angular"
      }
    }
)