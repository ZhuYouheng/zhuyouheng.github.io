#### 3.1
Use two method to prove that $\forall K\in L^1(\mathbb{R}^n)$, $\forall p \in [1,\infty]$, $\forall f\in L^p(\mathbb{R}^n)$, we have
$$\|K*f\|_{p}\leq \|K\|_1\cdot\|f\|_p$$

**Proof 1:** The simplist way is to directly apply the Minkowski's inequality.
$$
\begin{aligned}
\|K*f\|_p&=\left(\int_{\mathbb{R}^n}\left|\int_{\mathbb{R}^n}K(x-y)f(y)dy\right|^pdx\right)^{1/p}\\
&\leq \int_{\mathbb{R}^n}\left(\int_{\mathbb{R}^n}\left|K(x-y)f(y)\right|^pdx\right)^{1/p}dy\\
&=\int_{\mathbb{R}^n}\left(\int_{\mathbb{R}^n}\left|K(x-y)\right|^p\left|f(y)\right|^pdx\right)^{1/p}dy\\
&=\int_{\mathbb{R}^n}\left(\int_{\mathbb{R}^n}\left|K(x-y)\right|^pd\mu(x)\right)^{1/p}\cdot\left(\int_{\mathbb{R}^n}\left|f(y)\right|^pd\mu(y)\right)^{1/p}\\
&=\|K\|_1\cdot\|f\|_p
\end{aligned}
$$


