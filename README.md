# Pahiram Services (s12g7)

A simple web app simulation of DLSU-USG's *Pahiram Locker* and DLSU-CSG's *Pahiram Services*. Features a rental system for lockers and equipment such as umbrellas, extension cords, VGA and HDMI cables, and markers. 

## Features
* Users may log in and register via their DLSU Google accounts
* Two user roles (student and student representative)
* Students may edit their profile (contact number. To edit other info, the user has to approach the student representative).
* Students may reserve lockers and equipment (subject to Pahiram Services' terms and conditions).
* Students may view reservations made, and cancel ones that are on their initial stages when they change their minds.
* Students may view the terms and conditions of Pahiram Services.
* Student representatives may manage lockers (i.e. add new panels from specified locations, view panels and their respective lessees, mark broken lockers, and delete vacant panels).
* Student representatives may manage equipment (i.e. add new equipment, update equipment availability, view a list of all equipment, and delete equipment)
* Student representatives may manage all types of reservations (e.g. view all reservations and respond to them by changing their statuses and attaching remarks, as well as charging penalties for uncleared reservations)
* Student representatives may manage people (view all users and update their important profile information such as ID number and name)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
```
MongoDB server
Node.js
Node Package Manager (NPM)
Git *(optional)
```
### Installation and Setup
1. Clone repository
```
git clone https://github.com/ccapdev1920T2/s12g7.git
```
2. Install all npm packages used by typing the following command in the terminal:
```
npm install
```
**NOTE:** Google OAuth 2.0 has been used to authenticate and authorize DLSU users. Due to privacy reasons, the OAuth client ID and secret key have been removed from the source code. These credentials, along with the setup instructions, will be privately sent to the instructor instead for checking.
### Running
Run server (access at *localhost:3000*)
```
node index.js
```
## Authors
- Badulis, Keith Gabriel
- Gagan, Isser Troy
- Matias, Maria Angela Mikaela

## Acknowledgements
- Sir Arren for patiently teaching us
