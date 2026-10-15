---
layout: single
title: "Two Sobolev Spaces for Stein-Kernelized Monte Carlo"
eyebrow: "Research notes · Monte Carlo integration"
author: "Youheng Zhu"
date: 2026-10-14
completed_note: "completed in June 2026"
show_cite: true
videourl: /videos/two-space-stein/
excerpt: "A two-space Sobolev refinement of Lam and Zhang's Stein-kernelized Monte Carlo estimator, with a full proof and an extension to Stein-generated Hilbert scales."
permalink: /notes/two-space-stein/
body_class: academic-page
author_profile: false
read_time: true
comments: false
share: false
related: false
---

<link rel="stylesheet" href="{{ '/assets/css/sobolev-note.css' | relative_url }}?v={{ site.time | date: '%s' }}">

<div class="sobolev-note" markdown="1">

<p class="note-lead">We want to estimate an expectation under a target distribution, using samples drawn from another distribution. Function evaluations may also contain simulation noise. The aim is to correct the sampling bias while using the structure of the integrand to reduce Monte Carlo error.</p>

[Henry Lam and Haofeng Zhang's doubly robust Stein-kernelized estimator](https://jmlr.org/papers/v24/21-1313.html) addresses this problem by combining a learned control functional with sample weights chosen through a Stein kernel. We will first develop their construction and explain its double robustness.

A similar idea of using different spaces for approximation and integration appears in [Oates and Girolami (2016)](https://proceedings.mlr.press/v51/oates16.html) for QMC control functionals. Here, we apply this idea to improve the DRSK convergence rate.

<nav class="note-toc" aria-label="On this page">
<p class="note-kicker">On this page</p>
<ol>
<li><a href="#learn-and-reweight">The problem and Lam–Zhang's estimator</a></li>
<li><a href="#two-factors">Why doubly robust?</a></li>
<li><a href="#spectrum">A spectrum of norms</a></li>
<li><a href="#two-spaces">Two spaces, one estimator</a></li>
<li><a href="#stein-kernels">Constructing the Sobolev–Stein kernels</a></li>
<li><a href="#proof">The proof</a></li>
<li><a href="#parameters">What the two smoothness levels control</a></li>
<li><a href="#generalization">Beyond Sobolev: a Stein-generated Hilbert scale</a></li>
</ol>
</nav>

<h2 id="learn-and-reweight">1. The problem and Lam–Zhang's estimator</h2>

<h3>What is observed, and what is the target?</h3>

Suppose a simulator produces independent observations $$(X_i,F_i)$$, where

$$
X_i\sim q,\qquad F_i=f(X_i,Y_i).
$$

The variable $$X$$ is the input we want to integrate over; $$Y$$ represents randomness inside the function evaluation. Define the conditional mean

$$
\bar f(x)=\mathbb E[f(X,Y)\mid X=x].
$$

Our target is its expectation under a specified distribution $$\pi$$:

$$
\theta=\pi(\bar f):=\int_M\bar f(x)\pi(x)\,dx.
$$

For example, $$X$$ could describe a model parameter and $$F$$ the output of a stochastic simulation at that parameter. The available runs use a convenient sampling distribution $$q$$, while the scientific question asks for an average under $$\pi$$. Here and below, $$\pi$$ and $$q$$ denote the distributions of $$X$$, and $$dx$$ is the volume measure on its state space $$M$$.

The setting has three useful pieces of structure:

- **The target density is known up to normalization.** We can evaluate an unnormalized density $$\gamma$$ with $$\pi=\gamma/Z$$, and its score $$\nabla\log\pi=\nabla\log\gamma$$. The construction uses this score to build Stein kernels.
- **The conditional observation law is shared.** Both the target and sampling settings use the same distribution $$p(dy\mid x)$$ for $$Y$$ given $$X=x$$. Thus $$\bar f(x)$$ is the same function in both settings. This is the covariate-shift assumption.
- **The samples cover the target.** The density ratio $$\rho=\pi/q$$ exists, and the analysis uses $$\rho\le B$$. Coverage supplies data wherever the target assigns mass. The weighting algorithm uses a kernel matrix rather than evaluations of $$q$$.

An ordinary sample average estimates $$q(\bar f)$$. Our goal is $$\pi(\bar f)$$. In addition to this distribution shift, the observations contain the zero-mean conditional fluctuation

$$
\varepsilon=F-\bar f(X),\qquad\mathbb E[\varepsilon\mid X]=0.
$$

Lam and Zhang combine two tools to address these two sources of error: **control functionals** learn the predictable part of $$F$$, and **black-box importance sampling** balances the samples against the target.

<h3>Control functionals: learn a function with a known integral</h3>

Start with a Stein kernel $$k_\pi$$ and its reproducing kernel Hilbert space $$\mathcal H_\pi$$. Every function in this space has zero target mean:

$$
\pi(h)=0\qquad\text{for every }h\in\mathcal H_\pi.
$$

Use the first $$m$$ observations to fit $$s_m=c_m+g_m$$, with $$g_m\in\mathcal H_\pi$$, by kernel ridge regression in $$\mathbb R\oplus\mathcal H_\pi$$. The regression kernel is $$1+k_\pi$$, and the fitted function has the known integral $$\pi(s_m)=c_m$$.

Now adjust each observation by

$$
F_m(x,y)=f(x,y)-s_m(x)+\pi(s_m).
$$

This preserves the target expectation. Its conditional mean is $$\bar f(x)-s_m(x)+\pi(s_m)$$, which becomes nearly constant as the fit improves. Monte Carlo then averages a smaller residual. This is the control-functional mechanism for variance reduction.

<h3>Black-box importance sampling: balance a class of test functions</h3>

Write $$Z_i=X_{m+i}$$ for the remaining $$N=n-m$$ inputs. Choose nonnegative weights with $$\sum_iw_i=1$$ by minimizing the Stein discrepancy

$$
D^2(w)
=\left\|\sum_{i=1}^Nw_i k_\pi(Z_i,\cdot)\right\|_{\mathcal H_\pi}^{2}
=\sum_{i,j=1}^Nw_iw_jk_\pi(Z_i,Z_j).
$$

Because the Stein functions have zero target mean, this objective measures how closely the weighted samples reproduce their target integrals. The weights are obtained from a quadratic program, with a cap $$w_i\le B_0/N$$ to control their concentration. They are chosen to integrate the test class accurately; estimating the density ratio point by point is unnecessary.

<h3>DRSK: apply the weights to the adjusted observations</h3>

Lam and Zhang's doubly robust Stein-kernelized estimator combines the two steps:

$$
\widehat\theta_{\mathrm{DRSK}}
=\pi(s_m)+\sum_{i=1}^N\widehat w_i\bigl(F_{m+i}-s_m(Z_i)\bigr).
$$

The training split supplies $$s_m$$; the independent second split supplies the weights and residual observations. In their construction, regression uses $$1+k_\pi$$ and weighting uses $$k_\pi$$. The common Stein space connects the two steps in the error analysis.

<h2 id="two-factors">2. Why doubly robust?</h2>

There are two routes to an accurate estimate. **A good fit** makes the conditional mean of the adjusted observation nearly constant, so the answer depends less on where the samples lie. **Good weights** integrate the remaining residual accurately, so they can compensate for an imperfect fit. For example, if $$s_m=\bar f$$, only the conditional noise remains; if $$s_m=0$$, the construction becomes the BBIS estimate of the original observations.

The two routes appear as a product in the integration-error bound. To see this directly, take noiseless observations, so $$F_i=f(X_i)$$ and $$\bar f=f$$. We use this smooth-integration setting for the Sobolev construction in the rest of the post.

Write $$\widehat\nu_w=\sum_iw_i\delta_{Z_i}$$ for the weighted empirical measure. The estimation error has a useful exact form:

$$
\widehat\theta-\theta
=(\widehat\nu_w-\pi)(f-s_m).
$$

Center the regression residual under the target:

$$
e_m=f-s_m,
\qquad h_m=e_m-\pi(e_m).
$$

Since both $$\widehat\nu_w$$ and $$\pi$$ have mass one, centering leaves the error unchanged. If $$h_m$$ belongs to the Stein RKHS used for the weights, the reproducing property gives

$$
\begin{aligned}
\widehat\theta-\theta
&=\sum_{i=1}^Nw_i h_m(Z_i)\\
&=\left\langle h_m,\sum_{i=1}^Nw_i k_\pi(Z_i,\cdot)\right\rangle_{\mathcal H_\pi}.
\end{aligned}
$$

Cauchy–Schwarz then separates the two tasks:

$$
|\widehat\theta-\theta|
\le
\underbrace{\|h_m\|_{\mathcal H_\pi}}_{\text{residual size}}
\underbrace{D(w)}_{\text{weighted integration error}}.
$$

This explains the double robustness: either factor can make the product small when the other remains controlled. Learning and weighting can also improve together.

With noisy observations, the same calculation applies to $$\bar f-s_m$$, and the estimation error has the additional term $$\sum_i\widehat w_i\varepsilon_{m+i}$$. Its conditional mean is zero. With bounded weights, its mean squared contribution is $$O(M_0/N)$$, where $$M_0=\mathbb E_q[\varepsilon^2]<\infty$$ measures the observation noise. The smooth integration term and the conditional-noise term therefore have separate roles.

Under their source and coverage assumptions, Lam and Zhang obtain the bound

$$
\mathbb E[(\widehat\theta_{\mathrm{DRSK}}-\theta)^2]
\lesssim C_f n^{-1/2-r}+M_0n^{-1},
\qquad \frac12\le r\le1.
$$

The source exponent $$r$$ describes how well the conditional mean can be approximated by the regression kernel; $$C_f$$ contains its source norm. For $$r>1/2$$, the smooth term decays faster than the canonical Monte Carlo MSE rate $$n^{-1}$$. Their stronger spectral assumptions yield a further $$o(1)$$ factor on that smooth term. These results make the residual–discrepancy pairing a useful starting point for designing an estimator.

We now apply this two-space viewpoint to the DRSK residual–discrepancy bound. For an integer $$s\ge0$$, the Sobolev norm in $$H^s$$ controls the function and its square-integrable derivatives through order $$s$$; fractional orders describe intermediate regularity. Increasing $$s$$ puts a stronger penalty on rapidly varying components of a function.

Kernel ridge regression will learn in a smoother Sobolev space $$H^\tau$$, while weighting uses a Stein space of order $$a<\tau$$. An interpolation inequality connects the two. The following spectrum explains how to choose a norm that both controls the residual and accommodates point samples.

<h2 id="spectrum">3. A spectrum of norms</h2>

Why does the choice of norm matter? A signed measure $$\eta$$ acts on a test function $$g$$ through $$\eta(g)=\int g\,d\eta$$. A dual norm measures how large this action can be over a specified class of test functions:

$$
\|\eta\|_{\mathcal F^*}
=\sup_{\|g\|_{\mathcal F}\le1}|\eta(g)|.
$$

The test class determines which differences between distributions remain visible. The following spectrum moves from local density information toward averages of regular functions.

{% include sobolev-norm-spectrum.html %}

**At the density end, point masses matter.** An empirical measure is a finite sum of Dirac masses. Against a smooth target density on a positive-dimensional manifold, their difference has no $$L^2(dx)$$ density. Correspondingly, evaluation at a point is not a bounded functional on $$L^2$$: an increasingly narrow bump can have small $$L^2$$ norm and a large value at that point.

Total variation also sees the finite sample support exactly. If $$A=\{Z_1,\ldots,Z_N\}$$ and $$\pi$$ has a density, then $$\widehat\nu_w(A)=1$$ and $$\pi(A)=0$$. With the convention $$d_{\mathrm{TV}}(\mu,\nu)=\sup_A\lvert\mu(A)-\nu(A)\rvert$$, the distance is one.

**Geometric and smooth tests average over that local structure.** The Wasserstein distance $$W_1$$ compares measures through 1-Lipschitz test functions. Nearby points have nearby function values, and an i.i.d. empirical measure converges to its sampling distribution in this metric on a compact space. The convergence rates reflect the dimension and geometry of the distribution; [Weed and Bach](https://arxiv.org/abs/1707.00087) develop this dependence in detail.

Sobolev tests provide another way to control regularity. On a compact $$d$$-dimensional manifold, the embedding

$$
H^a(M)\hookrightarrow C(M),\qquad a>\frac d2,
$$

makes point evaluation continuous. Thus $$\delta_x$$ belongs to the dual space $$H^{-a}(M)$$. An empirical measure can now be paired with the residual using a finite, useful norm.

Within this Sobolev scale, increasing $$a$$ imposes more smoothness on the test functions and gives a weaker dual norm. For $$a_2>a_1>d/2$$,

$$
\|\eta\|_{H^{-a_2}}
\lesssim\|\eta\|_{H^{-a_1}}.
$$

The same choice has a complementary effect on the residual: reducing $$a$$ makes its $$H^a$$ norm easier to control. This is the balance we want to exploit.

The regression estimates explain why. For a suitable smoothness condition and regularization, the KRR residual satisfies the two endpoint bounds

$$
\mathbb E\|e_m\|_{L^2(q)}^2\lesssim m^{-1},
\qquad
\mathbb E\|e_m\|_{H^\tau(M)}^2\lesssim m^{-1/2}.
$$

An intermediate $$H^a$$ norm inherits part of the faster $$L^2$$ rate. We choose $$a$$ above the point-evaluation threshold and below the fitting smoothness:

$$
\boxed{\frac d2<a<\tau.}
$$

For each fixed such $$a$$, the weight argument below supplies an $$O(N^{-1})$$ bound for the squared discrepancy. The gain then comes from transferring the regression accuracy to $$H^a$$.

<h2 id="two-spaces">4. Two spaces, one estimator</h2>

We now specify the setting and the estimator. Let $$M$$ be a compact, connected, smooth Riemannian manifold without boundary, of dimension $$d\ge1$$. The target and sampling densities $$\pi,q$$ are smooth and strictly positive. Let $$f:M\to\mathbb R$$ be smooth, and assume a bounded density ratio

$$
\rho=\frac\pi q\le B.
$$

Fix $$d/2<a<\tau$$. For $$b\in\{a,\tau\}$$, use a Stein kernel $$k_{\pi,b}$$ whose RKHS is norm-equivalent to the mean-zero Sobolev space:

$$
\mathcal H_{\pi,b}
\simeq\{h\in H^b(M):\pi(h)=0\}
\simeq H^b(M)/\mathbb R.
$$

The quotient identifies functions that differ by a constant. Its norm is

$$
\|[g]\|_{H^b/\mathbb R}
=\inf_{c\in\mathbb R}\|g+c\|_{H^b}.
$$

We will construct these kernels in the next section. Their diagonals are bounded, and adjoining the constant kernel gives

$$
k_{\mathrm{cf}}=1+k_{\pi,\tau},
\qquad
\mathcal H(k_{\mathrm{cf}})
=\mathbb R\oplus\mathcal H_{\pi,\tau}
\simeq H^\tau(M).
$$

The approximation assumption is expressed through the integral operator

$$
(T_{\tau,q}g)(x)
=\int_M k_{\mathrm{cf}}(x,y)g(y)q(y)\,dy.
$$

For the main result, assume the source condition $$f\in\operatorname{Range}(T_{\tau,q})$$: there is a $$v\in L^2(q)$$ with $$f=T_{\tau,q}v$$. This is the condition that yields the two KRR endpoint rates above.

The condition has a useful spectral interpretation. In a complete orthonormal eigenbasis of $$L^2(q)$$, write $$T_{\tau,q}v_j=\sigma_j v_j$$ with $$\sigma_j>0$$ and $$f=\sum_j f_j v_j$$. The source condition is then

$$
\sum_j\frac{|f_j|^2}{\sigma_j^2}<\infty.
$$

It requires sufficiently little energy in directions with small kernel eigenvalues. This connects the integrand's regularity to the particular fitting kernel: choosing $$\tau$$ also changes the eigenvalues against which its coefficients are measured.

<div class="note-callout" markdown="1">

<p class="note-callout__label">Algorithm · Learn high, weigh low</p>

**Fit in the smoother space.** On the first $$m$$ samples, use kernel ridge regression with $$\lambda\asymp m^{-1/2}$$:

$$
s_m=\underset{g\in\mathbb R\oplus\mathcal H_{\pi,\tau}}{\arg\min}
\left\{
\frac1m\sum_{j=1}^m(f(X_j)-g(X_j))^2
+\lambda\|g\|_{\mathbb R\oplus\mathcal H_{\pi,\tau}}^2
\right\}.
$$

**Balance in the rougher space.** On the remaining $$N$$ samples, minimize

$$
\begin{aligned}
\widehat w&\in\underset{w\in\mathcal W_N}{\arg\min}\;D_a^2(w),\\
D_a^2(w)&=\sum_{i,j=1}^Nw_iw_jk_{\pi,a}(Z_i,Z_j),\\
\mathcal W_N&=\left\{w:\ w_i\ge0,\ \sum_{i=1}^Nw_i=1,\ w_i\le\frac{B_0}{N}\right\},
\qquad B_0>2B.
\end{aligned}
$$

**Combine the known integral and the weighted residual.** Output

$$
\widehat\theta
=\pi(s_m)+\sum_{i=1}^N\widehat w_i\bigl(f(Z_i)-s_m(Z_i)\bigr).
$$

</div>

Both steps are finite-dimensional computations. If $$K_{\mathrm{cf}}=(k_{\mathrm{cf}}(X_i,X_j))_{i,j\le m}$$ and $$\mathbf f=(f(X_1),\ldots,f(X_m))^\top$$, then

$$
\alpha=(K_{\mathrm{cf}}+m\lambda I)^{-1}\mathbf f,
\qquad
s_m(x)=\sum_{j=1}^m\alpha_j k_{\mathrm{cf}}(X_j,x),
\qquad
\pi(s_m)=\sum_{j=1}^m\alpha_j.
$$

The weighting step is a convex quadratic program with a positive semidefinite kernel matrix.

<div class="note-callout note-callout--theorem" markdown="1">

<p class="note-callout__label">Theorem · Smooth, noiseless case</p>

Under the setting and source condition above,

$$
\mathbb E[(\widehat\theta-\theta)^2]
\le C\,m^{-1+a/(2\tau)}N^{-1}.
$$

For a fixed split fraction $$m=\lfloor\alpha n\rfloor$$ with $$0<\alpha<1$$,

$$
\mathbb E[(\widehat\theta-\theta)^2]
\le C_\alpha n^{-2+a/(2\tau)}.
$$

The constants depend on the fixed manifold, densities, kernels, smoothness levels, source norm, and weight cap. They are independent of $$m$$ and $$N$$.

</div>

**Rate comparison.** In this noiseless setting, with the same fitting kernel and source condition $$r=1$$, using the same space for both steps ($$a=\tau$$) gives the MSE bound $$O(n^{-3/2})$$. Choosing $$d/2<a<\tau$$ improves this bound to $$O(n^{-2+a/(2\tau)})$$; for example, $$\tau=2a$$ gives $$O(n^{-7/4})$$.

<h2 id="stein-kernels">5. Constructing the Sobolev–Stein kernels</h2>

The second-order Riemann–Stein operator used by [Barp, Oates, Porcu, and Girolami](https://arxiv.org/abs/1810.04946) is

$$
\mathcal L_\pi u
=\pi^{-1}\operatorname{div}(\pi\nabla u)
=\Delta u+\langle\nabla\log\pi,\nabla u\rangle.
$$

It depends on the target through its log-density gradient. Integration by parts on the boundaryless manifold gives

$$
\pi(\mathcal L_\pi u)
=\int_M\operatorname{div}(\pi\nabla u)\,dx=0.
$$

Choose a scalar base kernel $$K_b$$ with $$\mathcal H(K_b)\simeq H^{b+2}(M)$$ and the differentiability needed for the following expression. Apply the operator to both kernel arguments:

$$
k_{\pi,b}(x,y)
=\mathcal L_{\pi,x}\mathcal L_{\pi,y}K_b(x,y).
$$

The resulting kernel generates the image of the base RKHS under $$\mathcal L_\pi$$. Elliptic regularity identifies that image with the mean-zero functions in $$H^b(M)$$: the operator maps $$H^{b+2}$$ continuously into $$H^b$$, and the equation $$\mathcal L_\pi u=h$$ has a solution, unique up to a constant, for mean-zero $$h\in H^b$$. The solution estimate gives the equivalence of the induced RKHS norm and the Sobolev quotient norm.

This construction explains both useful properties at once. Kernel sections have known zero target mean, and their finite evaluations can be computed by differentiating a base kernel and using the target score.

<h3>A spectral picture</h3>

The two-derivative shift is especially transparent in the eigenbasis of the weighted Laplacian. Define

$$
A_\pi=-\mathcal L_\pi,
\qquad A_\pi\phi_j=\mu_j\phi_j,
$$

with an orthonormal eigenbasis in $$L^2(\pi)$$. Connectedness gives $$\mu_0=0$$ with constant $$\phi_0=1$$; for $$j\ge1$$, $$\mu_j>0$$ and $$\pi(\phi_j)=0$$. Elliptic regularity gives

$$
\left\|\sum_{j\ge1}c_j\phi_j\right\|_{H^b(M)}^2
\asymp\sum_{j\ge1}\mu_j^b c_j^2.
$$

A corresponding pair of kernels is

$$
\begin{aligned}
K_b^{\mathrm{spec}}(x,y)
&=1+\sum_{j\ge1}\mu_j^{-b-2}\phi_j(x)\phi_j(y),\\
k_{\pi,b}^{\mathrm{spec}}(x,y)
&=\sum_{j\ge1}\mu_j^{-b}\phi_j(x)\phi_j(y).
\end{aligned}
$$

Applying $$\mathcal L_\pi$$ to each argument multiplies the nonconstant term by $$(-\mu_j)^2$$ and removes the constant. The base kernel has Sobolev order $$b+2$$; its Steinized kernel has order $$b$$ and zero target mean.

For a concrete geometric base kernel, smoothly embed $$M$$ into a Euclidean space and restrict a Matérn kernel to that embedded manifold. A Matérn smoothness parameter $$\nu=b+2-d/2$$ yields the required Sobolev order $$b+2$$ on $$M$$. The restriction results of [Fuselier and Wright](https://doi.org/10.1137/110821846) provide this construction. The resulting kernel is then Steinized through the differential formula above.

<h2 id="proof">6. The proof</h2>

The proof combines Lam and Zhang's KRR estimates and their capped-BBIS comparison (Lemma 29) with Sobolev interpolation. The interpolation step measures the regression residual in the lower-order space. The weighting argument then controls the discrepancy of the optimized weights by comparing them with normalized importance weights.

Throughout the proof, $$C$$ may change from line to line and depends only on the fixed quantities in the theorem.

<h3>Step 1. Pair the centered residual with the weighted measure</h3>

Recall $$e_m=f-s_m$$ and $$h_m=e_m-\pi(e_m)$$. Since $$e_m\in H^\tau(M)\subset H^a(M)$$, its centered representative belongs to $$\mathcal H_{\pi,a}$$. The reproducing property gives

$$
\begin{aligned}
(\widehat\theta-\theta)^2
&=\left|\left\langle h_m,
\sum_{i=1}^N\widehat w_i k_{\pi,a}(Z_i,\cdot)
\right\rangle_{\mathcal H_{\pi,a}}\right|^2\\
&\le\|h_m\|_{\mathcal H_{\pi,a}}^2D_a^2(\widehat w)\\
&\le C\|[h_m]\|_{H^a/\mathbb R}^2D_a^2(\widehat w).
\end{aligned}
$$

The fitted function depends on the first sample split; the weights depend on the second. Hence

$$
\mathbb E[(\widehat\theta-\theta)^2]
\le C\,
\mathbb E\|[h_m]\|_{H^a/\mathbb R}^2
\;\mathbb E D_a^2(\widehat w).
\tag{1}
$$

<h3>Step 2. Interpolate the two regression bounds</h3>

Under $$f\in\operatorname{Range}(T_{\tau,q})$$ and $$\lambda\asymp m^{-1/2}$$, the KRR estimates in Corollaries 20 and 21 of [Lam and Zhang](https://jmlr.org/papers/volume24/21-1313/21-1313.pdf) give

$$
\mathbb E\|e_m\|_{L^2(q)}^2\le C m^{-1},
\qquad
\mathbb E\|e_m\|_{H^\tau(M)}^2\le C m^{-1/2}.
\tag{2}
$$

Here the source exponent is $$r=1$$, and equivalence of the regression RKHS and $$H^\tau$$ converts the second bound to Sobolev notation.

For each realization of the training sample, the **Sobolev interpolation theorem** ([Bergh and Löfström, 1976, Chapter 6](https://link.springer.com/chapter/10.1007/978-3-642-66451-9_6)) gives

$$
\|e_m\|_{H^a}^2
\le C\,
\|e_m\|_{L^2(dx)}^{2(1-a/\tau)}
\|e_m\|_{H^\tau}^{2a/\tau}.
$$

Because $$q$$ is continuous and strictly positive on compact $$M$$, it has a positive lower bound. Thus $$\|e_m\|_{L^2(dx)}\le C\|e_m\|_{L^2(q)}$$. Also $$[h_m]=[e_m]$$, so

$$
\|[h_m]\|_{H^a/\mathbb R}\le\|e_m\|_{H^a}.
$$

Take expectations and apply Hölder with exponents $$1/(1-a/\tau)$$ and $$\tau/a$$:

$$
\begin{aligned}
\mathbb E\|[h_m]\|_{H^a/\mathbb R}^2
&\le C\left(\mathbb E\|e_m\|_{L^2(q)}^2\right)^{1-a/\tau}
\left(\mathbb E\|e_m\|_{H^\tau}^2\right)^{a/\tau}\\
&\le C(m^{-1})^{1-a/\tau}(m^{-1/2})^{a/\tau}\\
&=C m^{-1+a/(2\tau)}.
\end{aligned}
\tag{3}
$$

This is the step where the gap between $$a$$ and $$\tau$$ enters the rate.

<h3>Step 3. Bound the optimized discrepancy</h3>

Let

$$
\Psi_a(x)=k_{\pi,a}(x,\cdot)\in\mathcal H_{\pi,a}.
$$

Sobolev embedding and compactness give a uniform bound on point evaluations. Equivalently, for some finite $$\kappa_a$$,

$$
\|\Psi_a(x)\|_{\mathcal H_{\pi,a}}^2
=k_{\pi,a}(x,x)\le\kappa_a^2.
\tag{4}
$$

Stein's identity gives $$\mathbb E_\pi\Psi_a(X)=0$$. Changing measure yields the useful centered feature:

$$
\mathbb E_q[\rho(X)\Psi_a(X)]=0.
\tag{5}
$$

Now define normalized oracle weights on the second sample split:

$$
w_i^\circ=\frac{\rho(Z_i)}{\sum_{j=1}^N\rho(Z_j)}.
$$

These weights serve as a comparison in the proof. The algorithm computes $$\widehat w$$ from the kernel matrix.

Consider the event

$$
E_N=\left\{\frac1N\sum_{j=1}^N\rho(Z_j)\ge\frac12\right\}.
$$

On this event,

$$
0\le w_i^\circ\le\frac{2B}{N}<\frac{B_0}{N},
\qquad\sum_iw_i^\circ=1.
$$

The oracle weights are therefore feasible. By optimality of $$\widehat w$$,

$$
\begin{aligned}
D_a^2(\widehat w)
&\le D_a^2(w^\circ)\\
&=\frac{\left\|N^{-1}\sum_{i=1}^N\rho(Z_i)\Psi_a(Z_i)\right\|^2}
{\left(N^{-1}\sum_{i=1}^N\rho(Z_i)\right)^2}\\
&\le4\left\|\frac1N\sum_{i=1}^N\rho(Z_i)\Psi_a(Z_i)\right\|^2
\qquad\text{on }E_N.
\end{aligned}
$$

The norms here are in $$\mathcal H_{\pi,a}$$. Independence of the samples and the zero mean in (5) remove the cross terms:

$$
\begin{aligned}
\mathbb E_q\left\|\frac1N\sum_{i=1}^N\rho(Z_i)\Psi_a(Z_i)\right\|^2
&=\frac1N\mathbb E_q\bigl[\rho(X)^2k_{\pi,a}(X,X)\bigr]\\
&\le\frac{B^2\kappa_a^2}{N}.
\end{aligned}
$$

Consequently,

$$
\mathbb E[D_a^2(\widehat w)\mathbf1_{E_N}]
\le\frac{4B^2\kappa_a^2}{N}.
\tag{6}
$$

To handle the complementary event, use $$0\le\rho\le B$$ and $$\mathbb E_q\rho=1$$. Hoeffding's inequality gives

$$
\mathbb P(E_N^c)\le\exp\!\left(-\frac{N}{2B^2}\right).
$$

For every feasible weight vector, nonnegativity and normalization give

$$
\begin{aligned}
D_a^2(w)
&=\left\|\sum_iw_i\Psi_a(Z_i)\right\|^2\\
&\le\left(\sum_iw_i\|\Psi_a(Z_i)\|\right)^2
\le\kappa_a^2.
\end{aligned}
$$

It follows that

$$
\mathbb E[D_a^2(\widehat w)\mathbf1_{E_N^c}]
\le\kappa_a^2\exp\!\left(-\frac{N}{2B^2}\right).
\tag{7}
$$

Combining (6) and (7), and absorbing the exponentially small term into the constant, yields

$$
\mathbb E D_a^2(\widehat w)\le C N^{-1}.
\tag{8}
$$

<h3>Step 4. Combine the two factors</h3>

Substitute (3) and (8) into (1):

$$
\mathbb E[(\widehat\theta-\theta)^2]
\le C m^{-1+a/(2\tau)}N^{-1}.
$$

For $$m\asymp N\asymp n$$, this becomes

$$
\boxed{\mathbb E[(\widehat\theta-\theta)^2]
\lesssim n^{-2+a/(2\tau)}.}
$$

The proof uses the smoother space to learn the integrand, the lower-order space to pair the residual with the sample measure, and interpolation to connect them.

<h2 id="parameters">7. What the two smoothness levels control</h2>

The exponent is easy to read once the roles of $$a$$ and $$\tau$$ are separated.

**The weighting level $$a$$ makes point samples usable.** The condition $$a>d/2$$ gives bounded point evaluations and a finite kernel diagonal. It is exactly what the discrepancy proof needs. Reducing $$a$$ toward this threshold also improves the residual exponent for fixed $$\tau$$.

**The fitting level $$\tau$$ supplies interpolation room.** Under the main source condition, the two regression endpoints are $$m^{-1}$$ in squared $$L^2$$ norm and $$m^{-1/2}$$ in squared $$H^\tau$$ norm. Measuring the residual at level $$a$$ yields the intermediate exponent $$-1+a/(2\tau)$$.

For fixed $$a$$, increasing the fitting smoothness $$\tau$$ brings the exponent closer to $$-2$$ when the integrand satisfies the source condition for the resulting kernel. Each choice has its own kernel constants and source norm.

<h3>Finite regularity</h3>

The same argument also shows how the integrand's regularity enters. More generally, retain the geometric and kernel assumptions and take an integrand satisfying, for a fixed $$\tau$$,

$$
f\in\operatorname{Range}(T_{\tau,q}^{r}),
\qquad \frac12\le r\le1.
$$

With $$\lambda\asymp m^{-1/2}$$, the two KRR bounds become

$$
\mathbb E\|e_m\|_{L^2(q)}^2\lesssim m^{-r},
\qquad
\mathbb E\|e_m\|_{H^\tau}^2\lesssim m^{-r+1/2}.
$$

Interpolation gives

$$
\begin{aligned}
\mathbb E\|[h_m]\|_{H^a/\mathbb R}^2
&\lesssim(m^{-r})^{1-a/\tau}(m^{-r+1/2})^{a/\tau}\\
&=m^{-r+a/(2\tau)}.
\end{aligned}
$$

The weight estimate (8) is unchanged. Hence

$$
\mathbb E[(\widehat\theta-\theta)^2]
\lesssim N^{-1}m^{-r+a/(2\tau)}
\asymp n^{-1-r+a/(2\tau)}.
$$

This expression captures the choice of fitting smoothness: increasing $$\tau$$ improves the interpolation factor, while the source exponent $$r$$ records how well the particular integrand fits that kernel. For fixed $$r$$ and the same fitting kernel, the gain over the same-space bound is $$\tfrac12-\tfrac{a}{2\tau}$$ in the exponent.

The useful design freedom is to assign a space to each task. Fit where the function's structure can be learned, balance where point samples define a controlled discrepancy, and use the relation between those spaces to bound the integral.

<h2 id="generalization">8. Beyond Sobolev: a Stein-generated Hilbert scale</h2>

The same analysis extends from Sobolev spaces to a Stein-generated Hilbert scale. A stable coefficient representation takes the place of Sobolev interpolation, and a bounded kernel diagonal supplies the point-evaluation control previously obtained from $$a>d/2$$. The discrepancy proof carries over directly. We construct the two Stein RKHSs from shared features, derive the coefficient inequality, and combine it with the regression bounds.

We keep the independent sample splits, the bounded density ratio $$\rho=d\pi/dq\le B$$, and the weight cap $$B_0/N$$ with $$B_0>2B$$. The state space is now denoted by $$\mathcal X$$. It carries a second-order Stein operator $$\mathcal L_\pi$$ satisfying

$$
\mathcal L_\pi 1=0,
\qquad \pi(\mathcal L_\pi u)=0
$$

for potentials $$u$$ in its Stein class. The Riemann–Stein operator from Section 5 has these properties.

<h3 id="generalized-features">Build the spaces from Stein features</h3>

Choose scalar potentials $$u_j$$ in the Stein class and form the features

$$
\psi_j=\mathcal L_\pi u_j,
\qquad \pi(\psi_j)=0.
$$

Assume these features form a **Riesz basis** of a closed subspace $$V\subset\{h\in L^2(q):\pi(h)=0\}$$. This means that they give unique, stable coordinates: there are constants $$0<c_R\le C_R<\infty$$ such that, for every finite coefficient sequence,

$$
c_R\sum_j d_j^2
\le\left\|\sum_j d_j\psi_j\right\|_{L^2(q)}^2
\le C_R\sum_j d_j^2.
$$

Let $$\omega_j\uparrow\infty$$ be positive weights. For $$s\ge0$$, define

$$
\begin{aligned}
\mathcal H_s^{\mathrm{St}}
&=\left\{h=\sum_{j\ge1}d_j\psi_j:
\sum_{j\ge1}\omega_j^s d_j^2<\infty\right\},\\
\|h\|_{\mathcal H_s^{\mathrm{St}}}^2
&=\sum_{j\ge1}\omega_j^s d_j^2.
\end{aligned}
$$

Increasing $$s$$ puts more weight on the coefficients with large $$\omega_j$$. These nested spaces form a *Hilbert scale*. At level zero, the Riesz inequalities identify the coefficient norm with the $$L^2(q)$$ norm on $$V$$.

Choose $$0<a<\tau$$ and assume bounded point evaluations at the two levels used by the algorithm:

$$
\kappa_s^2:=\sup_{x\in\mathcal X}
\sum_{j\ge1}\omega_j^{-s}\psi_j(x)^2<\infty,
\qquad s\in\{a,\tau\}.
$$

Indeed, Cauchy–Schwarz gives

$$
\begin{aligned}
|h(x)|^2
&\le\left(\sum_j\omega_j^s d_j^2\right)
\left(\sum_j\omega_j^{-s}\psi_j(x)^2\right)\\
&\le\kappa_s^2\|h\|_{\mathcal H_s^{\mathrm{St}}}^2.
\end{aligned}
$$

Thus $$\mathcal H_s^{\mathrm{St}}$$ is an RKHS with kernel

$$
k_s^{\mathrm{St}}(x,y)
=\sum_{j\ge1}\omega_j^{-s}\psi_j(x)\psi_j(y).
$$

Every function in this space has zero target mean. To see this for an infinite expansion, the partial sums converge in $$L^2(q)$$, and the bounded density ratio makes $$\pi(h)=\mathbb E_q[\rho h]$$ continuous in that norm. In particular, $$\pi(k_s^{\mathrm{St}}(x,\cdot))=0$$.

<h3 id="generalized-kernels">Compute the kernels through Steinization</h3>

The potentials also provide scalar base kernels:

$$
K_s(x,y)=1+\sum_{j\ge1}\omega_j^{-s}u_j(x)u_j(y).
$$

Assume these series define kernels in the Stein class in each variable, with enough regularity to apply the two Stein operators term by term. Choose the base kernels and operator so that they can be evaluated from the unnormalized target density, without its normalizing constant. Then

$$
\begin{aligned}
\mathcal L_{\pi,x}\mathcal L_{\pi,y}K_s(x,y)
&=\sum_{j\ge1}\omega_j^{-s}
(\mathcal L_\pi u_j)(x)(\mathcal L_\pi u_j)(y)\\
&=k_s^{\mathrm{St}}(x,y).
\end{aligned}
$$

This supplies the same computational interface as before. KRR uses $$1+k_\tau^{\mathrm{St}}$$, whose RKHS is $$\mathbb R\oplus\mathcal H_\tau^{\mathrm{St}}$$ and whose fitted functions have known integrals. BBIS uses $$k_a^{\mathrm{St}}$$ and minimizes the quadratic form

$$
D_a^2(w)
=\sum_{i,j=1}^Nw_iw_j k_a^{\mathrm{St}}(Z_i,Z_j).
$$

The feature representation describes the spaces; the differential formula supplies kernel evaluations without the target normalizing constant.

<h3 id="generalized-interpolation">Interpolate the coefficients</h3>

The key inequality follows directly from the weighted coefficients. Set $$t=a/\tau\in(0,1)$$. For $$h=\sum_jd_j\psi_j\in\mathcal H_\tau^{\mathrm{St}}$$, Hölder's inequality and the lower Riesz bound give

$$
\begin{aligned}
\|h\|_{\mathcal H_a^{\mathrm{St}}}^2
&=\sum_j(d_j^2)^{1-t}(\omega_j^\tau d_j^2)^t\\
&\le\left(\sum_jd_j^2\right)^{1-t}
\left(\sum_j\omega_j^\tau d_j^2\right)^t\\
&\le c_R^{-(1-t)}
\|h\|_{L^2(q)}^{2(1-t)}
\|h\|_{\mathcal H_\tau^{\mathrm{St}}}^{2t}.
\end{aligned}
$$

Now take the centered residual $$h_m=(f-s_m)-\pi(f-s_m)$$. Suppose it belongs to $$\mathcal H_\tau^{\mathrm{St}}$$ almost surely and satisfies the two endpoint bounds

$$
\mathbb E\|h_m\|_{L^2(q)}^2\le b_m,
\qquad
\mathbb E\|h_m\|_{\mathcal H_\tau^{\mathrm{St}}}^2\le c_m.
$$

Apply the coefficient inequality to each realization of the training sample, then apply Hölder to the expectation:

$$
\begin{aligned}
\mathbb E\|h_m\|_{\mathcal H_a^{\mathrm{St}}}^2
&\le C\left(\mathbb E\|h_m\|_{L^2(q)}^2\right)^{1-t}
\left(\mathbb E\|h_m\|_{\mathcal H_\tau^{\mathrm{St}}}^2\right)^t\\
&\le C b_m^{1-a/\tau}c_m^{a/\tau}.
\end{aligned}
$$

<h3 id="generalized-bound">Pair the residual with the discrepancy</h3>

Because the weights sum to one, the error of the noiseless estimator is still

$$
\begin{aligned}
\widehat\theta-\theta
&=(\widehat\nu_{\widehat w}-\pi)h_m\\
&=\left\langle h_m,
\sum_i\widehat w_i k_a^{\mathrm{St}}(Z_i,\cdot)
\right\rangle_{\mathcal H_a^{\mathrm{St}}}.
\end{aligned}
$$

Cauchy–Schwarz and the independent sample splits therefore give

$$
\mathbb E[(\widehat\theta-\theta)^2]
\le\mathbb E\|h_m\|_{\mathcal H_a^{\mathrm{St}}}^2
\;\mathbb E D_a^2(\widehat w).
$$

The discrepancy proof in Section 6 applies to the feature map $$\Psi_a(x)=k_a^{\mathrm{St}}(x,\cdot)$$. Its two inputs are $$\mathbb E_q[\rho(X)\Psi_a(X)]=0$$ and $$\|\Psi_a(x)\|^2\le\kappa_a^2$$. Comparing with the normalized oracle weights on $$E_N=\{N^{-1}\sum_i\rho(Z_i)\ge1/2\}$$, and bounding its complement, yields

$$
\begin{aligned}
\mathbb E D_a^2(\widehat w)
&\le\frac4N\mathbb E_q[\rho(X)^2 k_a^{\mathrm{St}}(X,X)]\\
&\quad+\kappa_a^2\exp\!\left(-\frac{N}{2B^2}\right)\\
&\le C N^{-1}.
\end{aligned}
$$

Combining the two estimates gives the general bound:

<div class="note-callout note-callout--theorem" markdown="1">

<p class="note-callout__label">Stein Hilbert scale · Residual–discrepancy bound</p>

Under the construction, sampling assumptions, and residual bounds above,

$$
\boxed{\begin{gathered}
\mathbb E[(\widehat\theta-\theta)^2]\\
\le C N^{-1}b_m^{1-a/\tau}c_m^{a/\tau}.
\end{gathered}}
$$

The regression step supplies the two endpoint rates. The Hilbert scale transfers them to the weighting space, and BBIS contributes the factor $$N^{-1}$$.

</div>

<h3 id="generalized-rates">Insert the KRR rates</h3>

For a concrete rate, define the regression integral operator

$$
(T_{\tau,q}^{\mathrm{St}}g)(x)
=\int_{\mathcal X}[1+k_\tau^{\mathrm{St}}(x,y)]g(y)\,q(dy).
$$

In the noiseless setting, assume

$$
\begin{gathered}
f\in\operatorname{Range}((T_{\tau,q}^{\mathrm{St}})^r),\\
\frac12\le r\le1,
\qquad \lambda\asymp m^{-1/2}.
\end{gathered}
$$

The same KRR estimates used earlier give

$$
\begin{aligned}
\mathbb E\|e_m\|_{L^2(q)}^2&\lesssim m^{-r},\\
\mathbb E\|e_m\|_{\mathbb R\oplus\mathcal H_\tau^{\mathrm{St}}}^2
&\lesssim m^{-r+1/2},
\qquad e_m=f-s_m.
\end{aligned}
$$

Centering preserves these rates. Since $$\mathbb E_q\rho^2\le B$$,

$$
\begin{aligned}
|\pi(e_m)|&\le\sqrt B\,\|e_m\|_{L^2(q)},\\
\|h_m\|_{L^2(q)}&\le(1+\sqrt B)\|e_m\|_{L^2(q)}.
\end{aligned}
$$

In the direct-sum RKHS, taking the target mean extracts the constant component. Removing it gives

$$
\|h_m\|_{\mathcal H_\tau^{\mathrm{St}}}
\le\|e_m\|_{\mathbb R\oplus\mathcal H_\tau^{\mathrm{St}}}.
$$

Thus we can take $$b_m\lesssim m^{-r}$$ and $$c_m\lesssim m^{-r+1/2}$$. Substitution gives

$$
\begin{aligned}
\mathbb E[(\widehat\theta-\theta)^2]
&\lesssim N^{-1}(m^{-r})^{1-a/\tau}
(m^{-r+1/2})^{a/\tau}\\
&=N^{-1}m^{-r+a/(2\tau)}.
\end{aligned}
$$

With comparable split sizes, the rate is $$n^{-1-r+a/(2\tau)}$$. Setting $$r=1$$ recovers $$n^{-2+a/(2\tau)}$$ in the general Stein scale.

For noisy observations, use the centered residual of $$\bar f-s_m$$ and its corresponding regression bounds $$b_m,c_m$$. Conditional mean-zero noise removes the cross term with the integration error. Independence across the second split and the cap $$\widehat w_i\le B_0/N$$ give

$$
\begin{aligned}
&\mathbb E\left[\left(\sum_i\widehat w_i\varepsilon_{m+i}\right)^2\right]\\
&\quad=\mathbb E\sum_i\widehat w_i^2\mathbb E[\varepsilon_{m+i}^2\mid Z_i]\\
&\quad\le\frac{B_0^2M_0}{N}.
\end{aligned}
$$

The resulting bound is $$C N^{-1}b_m^{1-a/\tau}c_m^{a/\tau}+B_0^2M_0/N$$.

<h3 id="generalized-sobolev">Recover the Sobolev construction</h3>

Return to the compact manifold and the weighted-Laplacian eigenpairs from Section 5. For $$j\ge1$$, choose

$$
\begin{aligned}
u_j&=-\mu_j^{-1}\phi_j,\\
\psi_j&=\mathcal L_\pi u_j=\phi_j,\\
\omega_j&=\mu_j.
\end{aligned}
$$

The eigenfunctions are orthonormal in $$L^2(\pi)$$. Smooth positive densities on compact $$M$$ make the $$L^2(\pi)$$ and $$L^2(q)$$ norms equivalent, so they form the required Riesz basis of $$V=\{h\in L^2(q):\pi(h)=0\}$$. The scale and its base kernel become

$$
\begin{aligned}
\mathcal H_s^{\mathrm{St}}
&\simeq\{h\in H^s(M):\pi(h)=0\}\\
&\simeq H^s(M)/\mathbb R,\\
K_s(x,y)
&=1+\sum_{j\ge1}\mu_j^{-s-2}\phi_j(x)\phi_j(y).
\end{aligned}
$$

Sobolev embedding supplies the bounded diagonal when $$a>d/2$$, and the potentials account for the two-derivative shift in the base kernel. The coefficient proof shows how the same estimator and rate extend to other Stein-generated scales with stable coordinates, bounded kernel diagonals, and a computable Steinization.

<h2 id="references">References</h2>

- Henry Lam and Haofeng Zhang. [Doubly Robust Stein-Kernelized Monte Carlo Estimator: Simultaneous Bias-Variance Reduction and Supercanonical Convergence](https://jmlr.org/papers/v24/21-1313.html). *Journal of Machine Learning Research*, 24(85):1–58, 2023. The DRSK estimator, KRR bounds, and capped-BBIS comparison used in the proof.
- Chris Oates and Mark Girolami. [Control Functionals for Quasi-Monte Carlo Integration](https://proceedings.mlr.press/v51/oates16.html). *Proceedings of AISTATS*, PMLR 51:56–65, 2016. Separate approximation and integration spaces for control functionals, with residual–discrepancy error bounds.
- Alessandro Barp, Chris J. Oates, Emilio Porcu, and Mark Girolami. [A Riemann–Stein Kernel Method](https://arxiv.org/abs/1810.04946). *Bernoulli*, 28(4):2181–2208, 2022. The second-order Stein construction on a manifold.
- Edward Fuselier and Grady B. Wright. [Scattered Data Interpolation on Embedded Submanifolds with Restricted Positive Definite Kernels: Sobolev Error Estimates](https://doi.org/10.1137/110821846). *SIAM Journal on Numerical Analysis*, 50(3):1753–1776, 2012. Sobolev kernels obtained by restriction to an embedded manifold.
- Jöran Bergh and Jörgen Löfström. [*Interpolation Spaces: An Introduction*](https://link.springer.com/book/10.1007/978-3-642-66451-9). Springer, 1976. Chapter 6: interpolation of Sobolev and Besov spaces.
- Jonathan Weed and Francis Bach. [Sharp Asymptotic and Finite-Sample Rates of Convergence of Empirical Measures in Wasserstein Distance](https://arxiv.org/abs/1707.00087). *Bernoulli*, 25(4A):2620–2648, 2019. The geometric side of the spectrum of norms.

{% include sobolev-citation.html %}

</div>

<script src="{{ '/assets/js/sobolev-note.js' | relative_url }}" defer></script>
