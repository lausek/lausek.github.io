#!/usr/bin/python3

import datetime
import re
import os
import shutil
import sys

def log(*args):
    print(*args)

def abort(msg):
    log(msg)
    exit()

def get_tags_of(fname):
    import codecs
    metalines = 0
    with open(fname, 'r') as inp:
        for line in inp.readlines():
            if bytes(line, encoding='utf-8').startswith(codecs.BOM_UTF8 ):
                log(codecs.BOM_UTF8)
            # only read meta section which is separated by lines
            if re.match('(\s+)?---(.+)?', line.rstrip()):
                metalines += 1
                if 2 <= metalines:
                    return []
            else:
                result = re.match('(.+): (.+)', line)
                if result:
                    metakey = result.group(1).strip()
                    metavalues = map(lambda v: v.lower(), result.group(2).strip().split(' '))
                    if metakey == 'tags':
                        return list(metavalues)
    return []

def load_tags():
    known_tags = {}
    for post in os.listdir('_posts'):
        post_tags = get_tags_of('_posts/{}'.format(post))
        for tag in post_tags:
            if tag not in known_tags:
                known_tags[tag] = [post]
            else:
                known_tags[tag].append(post)
        log(post, post_tags)
    return known_tags

def as_name(post):
    return post.strip()[11:].replace('-', ' ').replace('.md', '').title()

def as_url(post, prefix=''):
    parts = post.replace('.md', '.html').split('-')
    return prefix + '/{}/{}/{}/{}'.format(parts[0], parts[1], parts[2], '-'.join(parts[3:]).replace('.md', '.html'))

def clean_tagged():
    if os.path.exists('./tagged'):
        shutil.rmtree('./tagged')

def build_tagged(tags):
    import subprocess

    cachedir = '/tmp/tagged-jekyll-cache/'
    if os.path.exists(cachedir):
        shutil.rmtree(cachedir)

    os.mkdir(cachedir)

    for tag, posts in tags.items():
        with open('{}{}.md'.format(cachedir, tag), 'w') as f:
            f.write('---\n')
            f.write('title: "Tagged: #{}"\n'.format(tag))
            f.write('layout: default\n')
            f.write('---\n')
            for post in posts:
                f.write('- [{}]({})\n'.format(as_name(post), as_url(post)))

    log('copy data...')
    shutil.copytree('./_data/', cachedir + './_data/')
    log('copy includes...')
    shutil.copytree('./_includes/', cachedir + './_includes/')
    log('copy layouts...')
    shutil.copytree('./_layouts/', cachedir + './_layouts/')
    log('copy css...')
    shutil.copytree('./css/', cachedir + './css/')

    subprocess.run(['jekyll', 'build',
                    '-s', cachedir,
                    '-d', cachedir + '_site',
                    '--layouts', cachedir + '_layouts',
                    '--config', './_config.yml'
                    ])
    
    shutil.rmtree(cachedir + '_site/css')

    return cachedir

# copy rendered html files into `tagged` folder
def move_tagged(cachedir):
    log('moving new tagged files...')
    os.rename(cachedir + '_site', './tagged')

# update `tagged` folder
def update():
    tags = load_tags()
    for key, value in tags.items():
        log(key, value)

    clean_tagged()
    cachedir = build_tagged(tags)
    move_tagged(cachedir)

    log('done.')

if __name__ == '__main__':
    update()
