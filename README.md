# Action for Running MATLAB Tests

The [Run MATLAB Tests](#run-matlab-tests) GitHub&reg; action enables you to run MATLAB&reg; and Simulink&reg; tests and generate artifacts such as JUnit test results and Cobertura code coverage reports. You can run tests and generate artifacts on a [GitHub-hosted](https://docs.github.com/en/free-pro-team@latest/actions/reference/specifications-for-github-hosted-runners) or [self-hosted](https://docs.github.com/en/free-pro-team@latest/actions/hosting-your-own-runners/about-self-hosted-runners) runner:

- If you want to use a self-hosted runner, you must set up a computer with MATLAB (R2013b or later) as your runner. The action uses the first MATLAB version on the runner's path.

- If you want to use a GitHub-hosted runner, you must include the [Set Up MATLAB](https://github.com/matlab-actions/setup-matlab/) action in your workflow to install MATLAB on the runner. Currently, this action is available only for public projects and does not include transformation products, such as MATLAB Coder&trade; and MATLAB Compiler&trade;.

## Usage Examples
Use the **Run MATLAB Tests** action to automatically run tests authored using the MATLAB Unit Testing Framework or Simulink Test&trade;. You can use this action with optional inputs to generate different types of test artifacts.

### Run MATLAB Tests on Self-Hosted Runner
Use a self-hosted runner to automatically run the the tests in your [MATLAB project](https://www.mathworks.com/help/matlab/projects.html).

```yaml 
name: Run MATLAB Tests on Self-Hosted Runner
on: [push]
jobs:
  my-job:
    name: Run MATLAB Tests
    runs-on: self-hosted
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Run tests
        uses: matlab-actions/run-tests@v0
```

### Generate Test Artifacts on GitHub-Hosted Runner
Use the [Set Up MATLAB](https://github.com/matlab-actions/setup-matlab/) action when you want to run tests and generate artifacts on a GitHub-hosted runner. The action installs your specified MATLAB release (R2020a or later) on a Linux virtual machine. If you do not specify a release, the action installs the latest release of MATLAB.

For example, install the latest release of MATLAB on a GitHub-hosted runner, and then use the **Run MATLAB Tests** action to run the tests in your MATLAB project and generate a JUnit test results report and a Cobertura code coverage report.

```yaml
name: Generate Test Artifacts on GitHub-Hosted Runner
on: [push]
jobs:
  my-job:
    name: Run MATLAB Tests and Generate Artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Install MATLAB
        uses: matlab-actions/setup-matlab@v0
      - name: Run tests and generate artifacts
        uses: matlab-actions/run-tests@v0
        with:
          test-results-junit: test-results/results.xml
          code-coverage-cobertura: code-coverage/coverage.xml
```
## Run MATLAB Tests
When you define your workflow in the `.github/workflows` directory of your repositoy, you can specify the **Run MATLAB Tests** action using the `run-tests` key. The action accepts optional inputs.

| Input     | Description |
|-----------|-------------|
| `test-results-junit` | (Optional) Path to write test results report in JUnit XML format. <br/> **Example**: `test-results/results.xml` |
| `code-coverage-cobertura` | (Optional) Path to write code coverage report in Cobertura XML format. <br/> **Example**: `code-coverage/coverage.xml` |
| `source-folder` | (Optional) Location of the folder containing source code, relative to the project root folder. <br/> The specified folder and its subfolders are added to the top of the MATLAB search path. If you specify `source-folder` and then choose to generate a coverage report, MATLAB uses only the source code in the specified folder and its subfolders to generate the report. You can specify multiple folders using a colon-separated or a semicolon-separated list. <br/> **Example**: `source` |

MATLAB includes any files in your project that have a `Test` label. If your workflow does not leverage a MATLAB project or uses a MATLAB release before R2019a, then MATLAB includes all tests in the root of your repository including its subfolders.

## Notes
By running the **Run MATLAB Tests** action, you will be executing third-party code that is licensed under separate terms.

## See also
- [Action for Running MATLAB Commands](https://github.com/matlab-actions/run-command/)
- [Action for Installing MATLAB on GitHub-Hosted Runner](https://github.com/matlab-actions/setup-matlab/)
- [Continuous Integration with MATLAB and Simulink](https://www.mathworks.com/solutions/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, please contact MathWorks&reg; at [continuous-integration@mathworks.com](mailto:continuous-integration@mathworks.com).
