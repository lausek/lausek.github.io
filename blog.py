#!/usr/bin/python3

import sys
from subprocess import Popen, PIPE

POST_FOLDER = '_posts/'
DRAFT_FOLDER = '_drafts/'

SUBOMMANDS = [
        'publish',
        'republish'
        ]

def error(msg):
    print(msg)
    sys.exit(1)

def check_yaml(raw):
    pass

def check_spelling(raw, lang):
    pass

def check_all(content):
    parts = content.split('---\n')
    # part 0 is an empty sequence
    if len(parts) < 3:
        print(parts)
        error('general layout of post is not valid')

    lang = 'en'

    check_yaml(parts[1])
    check_spelling(parts[2], lang)

def republish(new_file_name):
    # rebuild js search index
    pass

def publish(input_file_name):
    import datetime
    import os

    today = datetime.datetime.now()
    prefix = today.strftime('%Y-%m-%d-')
    new_file_name = POST_FOLDER + prefix + os.path.basename(input_file_name)

    if not move(input_file_name, new_file_name):
        error('move failed')

    return new_file_name

def move(old, new):
    process = Popen(['mv', old, new])
    process.wait()
    return process.returncode == 0

def main():
    global SUBOMMANDS

    if len(sys.argv) < 3:
        error('too few arguments')

    subcommand = sys.argv[1]
    input_file_name = sys.argv[2]

    try:
        with open(input_file_name, 'r') as input_file_handle:
            check_all(input_file_handle.read())

        if subcommand not in SUBOMMANDS:
            error("unknown subcommand `%s`" % subcommand)

        new_file_name = publish(input_file_name) if subcommand == 'publish' else input_file_name
        republish(new_file_name)

    except FileNotFoundError:
        error("file `%s` was not found" % input_file_name)

if __name__ == '__main__':
    main()
