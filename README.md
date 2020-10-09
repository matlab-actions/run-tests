# Run MATLAB® Tests

Use this action to run your MATLAB and Simulink® tests and generate artifacts
such as JUnit test results and Cobertura code coverage reports. To run the tests
in your project, the Run MATLAB Tests action uses the first MATLAB version on
the runner's system `PATH`.

## Usage

You can use this action `with`:
| Argument  | Description |
|-----------|-------------|
| `test-results-junit` | (Optional) Path to write test results report in JUnit XML format. <br/> **Example**: `test-results/results.xml` |
| `code-coverage-cobertura` | (Optional) Path to write code coverage report in Cobertura XML format. <br/> **Example**: `code-coverage/coverage.xml` |
| `source-folder` | (Optional) Location of the folder containing source code, relative to the project root folder. <br/> The specified folder and its subfolders are added to the top of the MATLAB search path. To generate a code coverage report, MATLAB uses only the source code in the specified folder and its subfolders. You can specify multiple folders using a colon-separated or a semicolon-separated list. <br/> **Example**: `source` |

## Example

```yaml
name: Sample workflow
on: [push]

jobs:
  my-job:
    name: Run MATLAB Tests and Save Results
    runs-on: ubuntu-latest
    steps:
      # Checkout the project from GitHub
      - uses: actions/checkout@v2

      # Set up MATLAB using this action first if running on a GitHub-hosted runner!
      - uses: mathworks/setup-matlab-action@v0
      
      # Run the MATLAB tests inside the repo and produce test artifacts
      - name: Run all the tests
        uses: mathworks/run-matlab-tests-action@v0
        with:
            test-results-junit: test-results/results.xml
            code-coverage-cobertura: code-coverage/coverage.xml
```

**Note**: MATLAB includes any files in your project that have a `Test` label. If
your pipeline does not leverage a MATLAB project or uses a MATLAB release
before R2019a, then MATLAB includes all tests in the root of your repository
including its subfolders.

## See also
- [Set up MATLAB action](https://github.com/mathworks/setup-matlab-action/)
- [Run MATLAB Command](https://github.com/mathworks/run-matlab-command-action/)
- [Continuous Integration (CI) - MATLAB & Simulink](https://www.mathworks.com/help/matlab/continuous-integration.html)

## Contact Us
If you have any questions or suggestions, please contact MathWorks® at continuous-integration@mathworks.com.

