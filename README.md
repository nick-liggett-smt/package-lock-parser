# Package Lock Parser

### Purpose
- This app is designed to take in a `package-lock.json` file, parse through it, and create a `.csv` file that is formatted to be compliant with the `Request for software used within each capability` ticket.

### Setup
- Clone down this repository by running the following command in your terminal.
  ```
  git clone git@github.com:nick-liggett-smt/package-lock-parser.git
  ```
### Using the app
- Once the repository is cloned down to your machine, you can run the program from the command line using the following format:
 ```node {path to cloned down project} {path to package-lock.json}```
- If all goes well, you should see a message logged to the console that says `"CSV file written to {path to file}"`
- You should now find a folder named `package-data` in your home directory. In that folder you will see the `.csv` file associated with the `package-lock.json` that what provided to the program.
