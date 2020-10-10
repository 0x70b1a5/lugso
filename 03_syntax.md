---
title: Syntax
permalink: /syntax/
---

<ol>
{% for spage in site.syntax %}
  <li>
    <a href="{{ spage.url | relative_url }}">
      {{ spage.title }}
    </a>
  </li>
{% endfor %}
</ol>