import inquirer from 'inquirer';
import chalk from "chalk";
function createBankAccount() {
    let balance = 0;
    return {
        balance,
        debit(amount) {
            if (amount > balance) {
                console.log(chalk.bgRed.white.bold("\n Insufficient funds. Transaction canceled."));
                return false;
            }
            balance -= amount;
            if (amount >= 100) {
                balance -= 1;
            }
            console.log(chalk.greenBright(`\nSuccessfully debited $${amount}. Current balance: $${balance} \n`));
            return true;
        },
        credit(amount) {
            if (amount >= 100) {
                balance -= 1;
                console.log(chalk.bgRed.white.bold("\n $ -1 (1 dollar deducted)"));
            }
            balance += amount;
            console.log(chalk.greenBright(`Successfully credited $${amount}. Current balance: $${balance}`));
        },
        getBalance() {
            return balance;
        }
    };
}
async function promptCustomerDetails() {
    const questions = [
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter your first name:',
            validate: (value) => {
                return value !== '' ? true : 'Please enter your first name.';
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter your last name:',
            validate: (value) => {
                return value !== '' ? true : 'Please enter your last name.';
            }
        },
        {
            type: 'number',
            name: 'age',
            message: 'Enter your age:',
            validate: (value) => {
                return value > 0 ? true : 'Please enter a valid age.';
            }
        },
        {
            type: 'list',
            name: 'gender',
            message: 'Select your gender:',
            choices: ['Male', 'Female', 'Other']
        },
        {
            type: 'input',
            name: 'mobileNumber',
            message: 'Enter your 11 digit mobile phone number (e.g (03001234567)):',
            validate: (value) => {
                const regex = /^\d{11}$/;
                return regex.test(value) ? true : 'Please enter a valid 11-digit mobile number (03001234567):';
            }
        }
    ];
    const answers = await inquirer.prompt(questions);
    return {
        firstName: answers.firstName,
        lastName: answers.lastName,
        age: answers.age,
        gender: answers.gender,
        mobileNumber: answers.mobileNumber,
        account: createBankAccount()
    };
}
async function main() {
    console.log(chalk.bgBlue.white.bold('\n Welcome to the customer registration process.\n'));
    let i = 5;
    const customer = await promptCustomerDetails();
    console.log(chalk.yellow('Customer Details:', customer.firstName, customer.lastName));
    console.log(chalk.yellow('age:', customer.age));
    console.log(chalk.yellow('Gender:', customer.gender));
    console.log(chalk.yellow('Contact:', customer.mobileNumber));
    const operations = [
        {
            type: 'list',
            name: 'operation',
            message: 'Select operation:',
            choices: ['Credit', 'Debit', 'Check Balance', 'Exit']
        }
    ];
    while (true) {
        const { operation } = await inquirer.prompt(operations);
        switch (operation) {
            case 'Credit':
                const creditAmount = await inquirer.prompt({
                    type: 'number',
                    name: 'amount',
                    message: 'Enter credit amount:'
                });
                customer.account.credit(creditAmount.amount);
                break;
            case 'Debit':
                const debitAmount = await inquirer.prompt({
                    type: 'number',
                    name: 'amount',
                    message: 'Enter debit amount:'
                });
                customer.account.debit(debitAmount.amount);
                break;
            case 'Check Balance':
                console.log(chalk.yellow('Customer Details:', customer.firstName, customer.lastName));
                console.log(chalk.yellow('age:', customer.age));
                console.log(chalk.yellow('Gender:', customer.gender));
                console.log(chalk.yellow('Contact:', customer.mobileNumber));
                console.log(chalk.bgBlue.white.bold(`Current balance: $${customer.account.getBalance()}`));
                break;
            case 'Exit':
                console.log(chalk.bgRed.white.bold('Exiting...'));
                return;
            default:
                console.log(chalk.bgRed.white.bold('Invalid operation.'));
                break;
        }
    }
}
main().catch((error) => console.error('Error:', error));
