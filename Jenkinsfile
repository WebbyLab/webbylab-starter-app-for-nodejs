// https://github.com/project-talan/tln-jenkins-shared-libraries
@Library('tln-jenkins-shared-libraries@20.6.0') _
import sh.tln.jenkins.*

properties([
  parameters(
    componentParams.getCommonParameters(paramConstant.TLN_PARAMS_COMMON | paramConstant.TLN_PARAMS_SCM | paramConstant.TLN_PARAMS_SONARQUBE, [
      //'TLN_COMPONENT_PARAM_HOST': '',
      //'TLN_COMPONENT_PARAM_LSTN': '',
      //'TLN_COMPONENT_PARAM_PORT': '',
      //'TLN_COMPONENT_PARAM_PORTS': '',
      //'TLN_SHARED_COMPONENTS_HOME': '',

      'TLN_GITHUB_ACCESS_TOKEN': '',

      'TLN_SONARQUBE_SERVER': '',
      'TLN_SONARQUBE_SCANNER': '',
      'TLN_SONARQUBE_QUALITY_GATES': false,
      'TLN_SONARQUBE_ACCESS_TOKEN': ''
    ])
  )
])

node {
  //
  def helper = new buildHelper(this, TLN_GITHUB_ACCESS_TOKEN, TLN_SONARQUBE_ACCESS_TOKEN)
  //
  stage('Checkout') {
    //
    // Let helper resolve build properties
    def scmVars = checkout scm
    helper.collectBuildInfo(scmVars, params)
    //
    // Create config for detached build
    sh "echo '{\"detach\": \"true\"}' > '.tlnrc'"
  }

  try {

    stage('Setup build environment') {
      // sh 'tln install --depends'
    }

    stage('Build') {
      // sh 'tln prereq:init:build'
    }

    stage('Unit tests') {
      // sh 'tln lint:test'
    }

    stage('SonarQube analysis') {
      // helper.runSonarQubeChecks(TLN_SONARQUBE_SERVER, TLN_SONARQUBE_SCANNER, TLN_SONARQUBE_QUALITY_GATES.toString().toBoolean())
    }

    stage('Delivery') {
      if (helper.pullRequest){
      } else {
        // create docker, push artifacts to the Harbor/Nexus/etc.
        // archiveArtifacts artifacts: 'path/2/artifact'
      }
    }

    stage('Deploy') {
      if (helper.pullRequest){
      } else {
      }
    }
  } catch (e) {
    def traceStack = e.toString()
    helper.sendEmailNotification('BUILD FAILED', "${BUILD_URL}\n${traceStack}")
    throw e
  }
}
