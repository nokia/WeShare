# WeShare

WeShare is a web application of matching people around differents topics (knowledge, issues, lifestyle, and so on). The principle is simple: I have the need, you have the knowledge!

## Demo

A [live preview](https://nokia.github.io/WeShare/index.aspx "The Open Source WeShare") of the open source version is available (it is still under development)

## What can I do in WeShare

- Help others: create a topic, explain how you can help the community (You're an expert of Excel, you know perfectly the process to change Nokia's computers, etc.)

- Ask for help: create a topic, explain what you need. (You are lost in a tool, you don't know how to print in color, you start a new project, etc.)

## How to use it
- You can edit your profile (add your phone number, disable notification) by clicking on your name in the right hand corner.
- You can find what you're looking for by searching in the list, browsering categories or choosing a type.

## Installation / Configuration
### Installation
The easiest way to start a WeShare project is to:
1. clone the project: `git clone https://github.com/nokia/WeShare` or get the zip file from github
2. go to the WeShare directory
3. install all dependencies: `npm install`
4. finally start the project: `npm start`

### Configuration
The project contains a configuration file in the directory `src`, called `config.js`
Use the file to change from dev to production and specify your Sharepoint path

### Sharepoint
WeShare needs Sharepoint to host 2 Sharepoint lists:
- a user list, `Users`
- a topic list, `Items`

Each list should have a column `Title` (requested by SharePoint) and a column `Data` which is of type: `Multiple lines of text`.

### Categories
1. go to public/json.categories
2. add categories in this array of strings
3. You can add subcategories with ["sub1", "sub2"]

## More

PS : WeShare is in beta version. It may have bugs, and your help can be a great treasure! 
