#!/usr/bin/python3

import datetime
import re
import os
import sys

REAL_RUN = '--go' in sys.argv

def log(*args):
    print(*args)

def abort(msg):
    log(msg)
    exit()

# TODO: move file from _drafts to _posts
def move_file(src):
    if not os.path.exists(src):
        abort('file not found')

    prefix = datetime.date.today().isoformat()
    target = '_posts/{}-{}'.format(prefix, os.path.basename(src))

    log('{} -> {}'.format(src, target))

    if os.path.exists(target):
        abort('file already in post')

    if REAL_RUN:
        os.rename(src, target)

def main():
    import tags

    if len(sys.argv) < 2:
        abort('no filename given')

    move_file(sys.argv[1])

    if REAL_RUN:
        tags.update()
    else:
        log('use argument --go to perform changes')

if __name__ == '__main__':
    main()
