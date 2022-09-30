# Bleam: A game builder for simple turn based games

## Instructions to set up Bleam locally

Install dependencies

```
$ yarn install
```

Set up an AWS Amplify project by following this [official guide](https://docs.amplify.aws/console/adminui/start/#get-started-without-an-aws-account).

Install the Amplify CLI by following these [instructions](https://docs.amplify.aws/console/adminui/extend-cli/#to-install-the-amplify-cli).

Setup the Amplify project locally. Launch Amplify Studio for your project and you can find the command when you click the **Local setup instructions** button in the header.

```
$ amplify pull --appId xxx --envName xxx
```

Generate the API client code using the cli

```
$ amplify add codegen
```

Start the app

```
$ yarn start
```
