#!groovy
@Library('waluigi@feature/TINY-10569') _

mixedBeehiveFlow(
  testPrefix: 'Tiny-Angular',
  testDirs: [ "tinymce-angular-component/src/test/ts/browser" ],
  platforms: [
    [ browser: 'chrome', headless: true ],
    [ browser: 'firefox', provider: 'aws', buckets: 1 ],
    [ browser: 'safari', provider: 'lambdatest', os: 'macOS Sonoma', buckets: 1 ]
  ],
  customSteps: {
    stage("storybook") {
      def status = beehiveFlowStatus()
      if (status.branchState == 'releaseReady' && status.isLatest) {
        sshagent (credentials: ['3e856116-029e-4c8d-b57d-593b2fba3cb2']) {
          exec('yarn storybook-to-ghpages')
        }
      } else {
        echo "Skipping as is not latest release"
      }
    }
  }
)

// beehiveFlowBuild(
//     container: [
//       tag: '20',
//       resourceRequestMemory: '4Gi',
//       resourceLimitCpu: '4',
//       resourceLimitMemory: '4Gi'
//     ],
//     test: {
//       bedrockBrowsers(testDirs: [ "tinymce-angular-component/src/test/ts/browser" ])
//     },
//     customSteps: {
//       stage("storybook") {
//         def status = beehiveFlowStatus();
//         if (status.branchState == 'releaseReady' && status.isLatest) {
//           sshagent (credentials: ['ccde5b3d-cf13-4d70-88cf-ae1e6dfd4ef4']) {
//             sh 'yarn storybook-to-ghpages'
//           }
//         } else {
//           echo "Skipping publish as is not latest release"
//           sh 'yarn storybook-to-ghpages --dry-run'
//         }
//       }
//     },
//     publish: {
//       tinyNpm.withNpmPublishCredentials('dist/tinymce-angular') {
//         sh "yarn beehive-flow publish --working-dir dist/tinymce-angular"
//       }
//     }
// )
