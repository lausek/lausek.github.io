---
layout: post
tags: programming
---

Every novice programmer nowadays will be introduced to the world of programming with an object oriented language like Java. In my opinion, this is a rather bad idea. Here's why...

## Background

A few days ago a friend of mine told me that he needs some help on his school project. The task was to implement a simple program that dumps the content of a CSV file to the stdout. He had to use Java, because that's the next big thing in software dev, right?

As I took a look at his initial code, the whole thing was split up into five classes and they didn't seem to have any reason whatsoever. Long story short: I rewrote the thing into a package consisting of three classes (which is also a frcking big overhead for the subject we are trying to solve).

## Understanding OOP

What makes OOP different is the way it handles state. While programming in memory based machines was doing baby steps, it became clear very quickly that global state is really bad to a broadly implemented software. One of the solutions was to *hide* state from everyone else so that other programmers didn't have to care about what happens inside a section and that the section itself was protected by people.

Back in the days that looked like **the thing** to do. Everybody adopted it.

## The real problem

I'm gonna risk it: OOP is outdated and cancerous. The way Java tries to implement the state-hiding is ridiculously wrong and misses the reality by far. I mean... How often did you implement an animal? How many times did you implement a parser, a serializer, a `<insert_topic>Factory`?

## What's the solution

Python. Python is perfect for beginners. Everything we want a newbie to know is in Python. We can open files very easily and processing lines becomes quite trivial.

## ... and?

Then your apprentice starts to notice that there are major problems with the way he is using the current language. Eventually he'll come up with the idea to switch to a language that fits the task better.
