import type {
  Reporter,
  TestCase,
  TestResult,
  FullConfig,
  FullResult,
  TestStep
} from '@playwright/test';

class MyReporter implements Reporter {

  onBegin(config: FullConfig) {
    console.log('TEST EXECUTION STARTED');
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`TEST STARTED: ${test.title}`);
  }

  onStepBegin(
    test: TestCase,
    result: TestResult,
    step: TestStep
  ) {
    if (step.category === 'test.step') {
      console.log(`ACTION STARTED: ${step.title}`);
    }
  }

  onStepEnd(
    test: TestCase,
    result: TestResult,
    step: TestStep
  ) {
    if (step.category === 'test.step') {
      console.log(`ACTION COMPLETED: ${step.title}`);
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`TEST FINISHED: ${test.title}`);
    console.log(`STATUS: ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log('TEST EXECUTION FINISHED');
  }
}

export default MyReporter;