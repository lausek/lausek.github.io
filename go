#!/bin/bash

cd $(dirname $(realpath "$0"))

task-setup() {
    echo "Installing ..."

    sudo apt-get update 1> /dev/null
    sudo apt-get install -y ruby ruby-dev 1> /dev/null

    gem install --user-install jekyll bundler

    echo "Ruby version:" $(ruby -v)
    echo "Gem version:" $(gem -v)
}

task-ensure-setup() {
    if ! [ -x "$(command -v ruby)" ]; then
        echo "Ruby not found. Run ./go setup ..."
        exit 1
    fi
}

task-dev() {
    task-ensure-setup

    bundle exec jekyll serve --livereload
}

"task-$1"
