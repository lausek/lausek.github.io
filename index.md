---
layout: default
---

<ul>
    {% for page in site.posts %}
        <li>
        {{ page.date | date: "%Y-%m-%d" }} - <a href="{{ page.url }}">{{ page.title }}</a>
        {% include tags.html %}
        </li>
    {% else %}
        No posts yet.
    {% endfor %}
</ul>
