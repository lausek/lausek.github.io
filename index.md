---
layout: default
---

<ul>
    {% for post in site.posts %}
        <li>{{ post.date | date: "%Y-%m-%d" }} - <a href="{{ post.url }}">{{ post.title }}</a></li>
    {% else %}
        No posts yet.
    {% endfor %}
</ul>
