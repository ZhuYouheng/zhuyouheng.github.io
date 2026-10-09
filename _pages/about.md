---
permalink: /
title: "Hi, I’m Youheng."
eyebrow: "Northwestern University · IEMS"
excerpt: "Youheng Zhu is a second-year PhD candidate at Northwestern University working on statistical learning theory and applied probability."
body_class: academic-page
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I’m a **second-year PhD candidate** in the Department of Industrial Engineering and Management Sciences at Northwestern University, advised by Prof. [Minshuo Chen](https://minshuochen.github.io/) and Prof. [Yiping Lu](https://2prime.github.io/) (now at the Beijing International Center for Mathematical Research, Peking University).

My research interests lie in **statistical learning theory and applied probability**. I like to study machine learning through the lens of function spaces, drawing on tools from analysis, information theory, and probability.

Before Northwestern, I worked with Prof. [Nan Jiang](https://nanjiang.cs.illinois.edu/) in Computer Science at UIUC starting in summer 2024, and Prof. [Yuheng Bu](https://buyuheng.github.io/) in Electrical and Computer Engineering at the University of Florida starting in summer 2023. I received my B.Eng. from Huazhong University of Science and Technology (HUST) in June 2025.

<nav class="section-nav" aria-label="On this page">
  <a href="#research">Research</a>
  <a href="#publications">Publications</a>
  <a href="#awards">Awards</a>
  <a href="#service">Service</a>
  <a href="#beyond-research">Beyond research</a>
</nav>

## Research

My current and developing interests include:

<div class="research-interests" markdown="1">
- Information theory and high-dimensional statistics
- Functional analysis, manifolds, and PDEs
- Random matrices
- Large deviations
- Stochastic simulation
- General machine learning theory
- Automatic theorem formalization and proving
- *Philosophy of mathematics*
</div>

> I think “infinity” is one of the best inventions in mathematics. I’m especially drawn to continuous and infinite-dimensional settings for their rich structure and the analytical tools they offer.

I also have experience in *computer graphics* and the *lattice Boltzmann method*.

## Publications

<p class="section-intro">Preprints and conference papers. <a href="{{ '/publications/' | relative_url }}">Browse by publication type &rarr;</a></p>

<div class="publication-list">
{% assign publications = site.publications | sort: 'date' | reverse %}
{% for post in publications %}
  {% include publication-single-minimal.html %}
{% endfor %}
</div>

## Awards

<ul class="awards-list">
  <li>
    <time datetime="2026-10">October 2026</time>
    <div><strong>NeurIPS Top Reviewer</strong><span>Top 8% of reviewers.</span></div>
  </li>
  <li>
    <time datetime="2026-09">September 2026</time>
    <div><strong>Arthur P. Hurter Award</strong><span>Best first-year PhD student in IEMS.</span></div>
  </li>
  <li>
    <time datetime="2026-05">May 2026</time>
    <div><strong>ICML Gold Reviewer</strong><span>Top 25% of reviewers.</span></div>
  </li>
</ul>

## Service

I serve as a reviewer for:

<dl class="service-list">
  <div><dt>Conferences</dt><dd>AAAI · AISTATS · ICLR · ICML · NeurIPS</dd></div>
  <div><dt>Journals</dt><dd>JML · MOR</dd></div>
</dl>

## Beyond research

Something more about me (due to optimization error, these are subject to change):

- My favorite director is Ikuhara Kunihiko (幾原 邦彦)
- My favorite band is Sōtaisei Riron (相対性理論)
- My favorite voice-actress unit is Trysail
- My favorite music producer/composer is Yuki Kajiura (梶浦 由記), including her projects FictionJunction and Kalafina.
- I enjoy (arcade) rhythm games.
