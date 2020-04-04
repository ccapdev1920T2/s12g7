# Pahiram Services (s12g7)

A simple web app simulation of DLSU-USG's *Pahiram Locker* and DLSU-CSG's *Pahiram Services*. Features a rental system for lockers and equipment such as umbrellas, extension cords, VGA and HDMI cables, and markers. 

## Features
* Login/register system (Google Sign-in integration)
* Two user roles (student and student representative)
* Edit profile information
* Rental/reservation system for both locker and equipment
* Locker and equipment management (*CRUD*) system for admins

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
NOTE: Google OAuth 2.0 has been used to authenticate and authorize DLSU users. Due to privacy reasons, the OAuth client ID and secret key have been removed from the source code. These credentials, along with the setup instructions, will be privately sent to the instructor instead for checking.
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
