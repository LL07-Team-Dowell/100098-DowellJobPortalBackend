# 100098-DowellJobPortalFrontend

Hello frontend developers!

This is the active branch you would be building from. 

<br />

## Table of Contents
- [Getting started](#getting-started)
- [Development](#development)

<br />

### Getting started
<b>Please read this very well before starting any work.</b>
</h3>

<br />

- Firstly, clone this branch to your local computer using this command:
```bash
git clone --single-branch -b frontend https://github.com/LL07-Team-Dowell/100098-DowellJobPortal.git
```

- Create your branch that you would be working on using this command:
```bash
git checkout -b <your-name-frontend>
```
For example, if your name is `ayo`, then you can modify the command to be:
```bash
git checkout -b ayo-frontend
```

- Navigate to the `100098-dowelljobportal` folder, a basic react application has been setup there.

- To start up the react application, you can use this:
```bash
cd 100098-dowelljobportal
npm install
npm start
```

- Each time before you begin working, please make sure to <b>PULL</b> all the recent changes from the `frontend` branch using this:
```bash
git pull origin frontend
```

- After working, please <b>PUSH</b> your changes to <b>YOUR</b> branch and only <b>YOUR</b> branch using this:
```bash
git push origin <your-name-frontend>
```

<br />
<br />

<h3>In summary:</h3>

- Pull first from the `frontend` branch before working
```bash
git pull origin frontend
```
- Work then add and commmit your changes using a descriptive message
```bash
git add .
git commit -m "Descriptive message here"
```
- Pull again from the `frontend` branch when done working
```bash
git pull origin frontend
```
- Push your changes to your branch
```bash
git push origin <your-name-frontend>
```

- That's all. <b>Happy hacking!</b>

### Development
- There are 2 fonts(Inter and Poppins) specified in the figma design for this project and they have already been imported in the `index.html` file. 

- To use a specific font (for example `Inter`), you can just declare the font-family in your css file like so:

```css
    font-family: 'Inter', sans-serif;
```

- Images you may need is inside the `public/src/assets` folder

- I have added a package: `react-icons` that you can use for icons. This is its documentation: [React icons documentation](https://react-icons.github.io/react-icons)
