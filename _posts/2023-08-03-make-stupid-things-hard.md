---
layout: post
tags: sql, mysql
---

We are able to create quite a lot of messed up situations by mindlessly throwing queries at our databases.
It begs the question though: Why don't databases get into our way more often?

Before diving into the topics I want to make clear that I'm not a big fan of conventions.
Sure, a lot of bad situations can be avoided by applying the same rules over and over again, but remembering is hard and following them requires discipline.
I also don't get why we want put all responsiblity on the programmer's shoulders.
Computers are just way better at remembering and following than we are.

So, here are some problems we occasionally run into and how mysql could prevent them.

# No search criteria 

Providing no `WHERE` conditions for `DELETE` or `UPDATE` statements is a recipe for disaster.
In most cases, it is not what we want and the consequences are severe.
A world with a better SQL would make a clear distinction between [DML](https://en.wikipedia.org/wiki/Data_manipulation_language) that affects a subset of rows and all rows in the table.

When I run this statement I actually want to be prompted with: _"Stop what you're doing. Take a step back. Think about it again."_

```sql
UPDATE equipment SET description = '<removed>';
```

The "affect everything" behavior should be opt-in for example by making an exception in the syntax

```sql
UPDATE equipment SET description = '<removed>' WHERE ...;
UPDATE ALL equipment SET description = '<removed>';
```

You are still able to wreak havoc to your table by using the wrong conditions but at least you did that intentionally

The cool thing is that the mysql cli already has an option to hold you back in such cases.
It's called the [--i-am-a-dummy](https://dev.mysql.com/doc/refman/8.0/en/mysql-command-options.html#option_mysql_safe-updates) or safe update flag.
This mode is not enabled by default though and it also doesn't make the intention clear.
A sql script may or may not cause harm depending on some flag you set on the command line.
I personally would want to avoid this and have safe mechanism built into the language itself.

# Implicit type conversions

What is the issue in the following code?

```sql
SELECT equipment WHERE id = 0;
```

If your `id` column is of type `VARCHAR`, you will probably mess up your result.
This is due to mysql's [implicit type conversion rules](https://dev.mysql.com/doc/refman/8.0/en/type-conversion.html) - namely;

> ... For example, a comparison of string and numeric operands takes place as a comparison of floating-point numbers. 

Every `id` that cannot be converted to a number will default to `0`.
Settings like `STRICT_ALL_TABLES` or `STRICT_TRANS_TABLES` also don't help in this case as they only prevent a mismatch in data types for DML like `INSERT`, `UPDATE` or `DELETE`.
For `SELECT` it only emits a warning.

We should not blindly accept this behavior just because it doesn't cause permanent problems to our table.
It is still an issue that could lead to incorrect results and enforcing correctness has the same priority as enforcing consistency - maybe even higher.

The solution is simple: Stop it.
Implicit type conversions should never have to happen.
Mysql should require you to cast your values and columns.
If casting fails, you have to provide a default value explicitly.
It should not be an opt-in feature.