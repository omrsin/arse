# arse

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.0.0-rc8.

## Getting Started

### Prerequisites

  - [MongoDB]
  https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-14-04

  - [nvm] - to install and manage node versions
  https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server
  install version 4.2.1 then execute: `nvm alias default v4.2.1` to set default node version

  - [Git]
  https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-14-04
  
  - [Sass]
  to install sass, firstly, ruby has to be installed.
  follow the following link to install only till the 'rbenv' part.
  https://www.digitalocean.com/community/tutorials/how-to-install-ruby-on-rails-with-rbenv-on-ubuntu-14-04
  here is the updated version of the modifications to the '.bashrc' file:
    
	git clone git://github.com/sstephenson/rbenv.git .rbenv
	echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
	echo 'eval "$(rbenv init -)"' >> ~/.bashrc

	git clone git://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
	echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
	source ~/.bashrc

   Install ruby version 1.9.3-p484
   Finally execute `gem install sass`

  - [Yeoman] 
    It might be the case that npm has to be updated first. To do so execute the following command:
	`npm install -g npm`

	Then execute this command:
	`npm install -g yo grunt-cli bower generator-angular-fullstack` 	

### Versions used
  - [MongoDB] : v3.0.9
  - [Git] : 1.9.1
  - [Node] : v4.2.1
  - [nvm] : 0.29.0
  - [npm] : 2.14.7


### Developing

1. Run `npm install` to install server dependencies.

2. Run `bower install` to install front-end dependencies.

3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.


## Build & development

Run `grunt build` for building and `grunt serve` for preview.


## Possible errors

1. "no locale found" problem : 
  - edit `/etc/ssh/ssh_config` as sudo
  - comment (#) `SendEnv LANG LC_*`

2. "ERROR: node-regyp"
  - ignore this problem 

