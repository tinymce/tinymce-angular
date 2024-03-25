#!groovy
@Library('waluigi@release/7') _

beehiveFlowBuild(
    container: [
      tag: '20',
      resourceRequestMemory: '4Gi',
      resourceLimitCpu: '4',
      resourceLimitMemory: '4Gi'
    ],
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
