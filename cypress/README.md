## Local env setup
create `cypress.env.json` in the root directory.

copy and paste the .env file inside and change to `json` format.

## Open Cypress GUI
```
npx cypress open
```

## Modify cypress secret
> https://docs.cypress.io/guides/guides/environment-variables#Option-1-configuration-file
> 
> We use option #2 in the article

If you want to modify env variables for cypress testing, first, modify `cypress.json` and add key value pair in env field. (you can leave it as empty string if you want to specify value in `cypress.env.json`)

Then, modify your `cypress.env.json`

At last, remember to update `cypress-e2e.yml` and corresponding github secrets.
