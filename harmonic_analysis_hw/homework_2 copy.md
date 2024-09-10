#### Finish the proof of Marcinkiewicz interpolation theorem
*Homework 1 asked us to prove the Riesz-Thorin Interpolation using the three-line lemma, which is form complex analysis. Consequently the R-T.I.T is called the complex interpolation theorem. As for the Marcinkiewicz interpolation theorem here, it is proved using only real analysis, and is therefore called the real interpolation theorem.*

**Theorem (M.I.T)** Let $(X,\mu)$ and $(Y,\nu)$ be measure spaces, $1\leq p_0<p_1\leq\infty$, $q_0\geq p_0$, $q_1\geq p_1$, and let $T$ be a sublinear operator from $L^{p_0}(X,\mu)+L^{p_1}(X,\mu)$ to the measurable functions on $(Y,\nu)$ that is weak $(p_0,q_0)$ and  weak $(p_1,q_1)$. Then $T$ is strong $(p,q)$ where $\frac{1}{p}=\frac{1-\theta}{p_0}+\frac{\theta}{p_1}$ and $\frac{1}{q}=\frac{1-\theta}{q_0}+\frac{\theta}{q_1}$, $\theta\in(0,1)$.

**Proof.** Let $f$ be a function in $L^p(X,\mu)$, we decompose $f$ as $f=f_0+f_1$ where
$$
f_0 = f \cdot \mathbb{I}_{\{|f| > C\lambda\}}\\
f_1 = f \cdot \mathbb{I}_{\{|f| \leq C\lambda\}},
$$

1. We first prove that $f_0\in L^{p_0}$ and $f_1\in L^{p_1}$. 
For $f_0$, we have
$$
\|f_0\|_{p_0}^{p_0} = \int_{\{|f| > C\lambda\}} |f|^{p_0} \, d\mu.
$$
which can be written as
$$
\begin{aligned}
\int_{\{|f| > C\lambda\}} |f|^{p_0} \, dx =& \int_{C\lambda}^{\infty} p_0 t^{p_0 - 1} \left( \int_{\{|f| > t\}} d\mu \right) dt\\
=&\int_{C\lambda}^{\infty} p_0 t^{p_0 - 1} \mu(\{|f| > t\})\ dt
\end{aligned}
$$
Notice that for a function $f$ in $L^p$, its $p$-norm is always larger than its $(p,\infty)$-norm, consequently, 
$$
\mu(\{|f| > t\}) \leq \frac{\|f\|_p^p}{t^p}
$$
And as a result
$$
\begin{aligned}
\|f_0\|_{p_0}^{p_0} =\int_{\{|f| > C\lambda\}} |f|^{p_0} \, dx 
=&\int_{C\lambda}^{\infty} p_0 t^{p_0 - 1} \mu(\{|f| > t\})\ dt\\
\leq &\,\|f\|_p^p\int_{C\lambda}^{\infty} p_0 t^{p_0 -p - 1}\,dt\\
=&\ \frac{p_0\|f\|_p^p}{(C\lambda)^{p-p_0}}<+\infty
\end{aligned}
$$
which indicates that $f_0\in L^{p_0}$.
For $f_1$, it is generally simpler. We can show that
$$
\begin{aligned}
\|f_1\|_{p_1}^{p_1}=&\int_{\{|f| \leq C\lambda\}} |f|^{p_1} \, d\mu\\
\leq&\ (C\lambda)^{p_1-p}\int_{\{|f| \leq C\lambda\}} |f|^{p} \, d\mu\\
\leq&\ (C\lambda)^{p_1-p}\int_{X} |f|^{p}\,d\mu\\
=& (C\lambda)^{p_1-p}\|f\|_p^p<+\infty
\end{aligned}
$$
which indicates that $f_1\in L^{p_1}$.

With the preparation, we have the following observation. According to the sublinear condition, we have
$$
|Tf(x)|\leq |Tf_0(x)|+|Tf_1(x)|
$$
so the pegion lemma tells us that
$$
\nu(\{x:|Tf(x)|>\lambda\})\leq\nu(\{x:|Tf_0(x)|>\lambda/2\})+\nu(\{x:|Tf_1(x)|>\lambda/2\})
$$
Then we prove the theorem within two subcases.

2. Subcase 1: $p_1=\infty$, thus $q_1=p_1=\infty$.
For the condition, we have
$$
\begin{aligned}
\|Tf\|_{q_0,\infty}\leq &\ A_0\|f\|_{p_0}\ \forall f\in L^{p_0} \\
\|Tf\|_{\infty}\leq &\ A_1\|f\|_{\infty}\ \forall f\in L^{\infty} 
\end{aligned}
$$
the second inequality indicate that
$$
\|Tf_1\|_{\infty}\leq A_1\|f_1\|_{\infty}\leq A_1C\lambda
$$
Selecting $C=1/(2A_1)$ and we get $\|Tf_1\|_\infty<\lambda/2$, so that $\nu(\{x:|Tf_1(x)|>\lambda/2\})=0$.
By the weak $(p_0,q_0)$ inequality,
$$
\bigg(\bigg(\frac{\lambda}{2}\bigg)^{q_0}\cdot\nu(\{x:|Tf_0(x)|>\frac{\lambda}{2}\})\bigg)^{\frac{1}{q_0}}\leq A_0\|f\|_{p_0}.
$$
With this, we have
$$
\begin{aligned}
\|Tf\|_q^q=&\ q\int_0^\infty\lambda^{q-1}\nu(\{x:|Tf(x)|>\lambda\})\ d\lambda\\
\leq&\ q\int_0^\infty\lambda^{q-1}\nu(\{x:|Tf_0(x)|>\frac{\lambda}{2}\})\ d\lambda\\
\leq&\ q\int_0^\infty\lambda^{q-1}\frac{(2A_0)^{q_0}\|f_0\|^{q_0}_{p_0}}{\lambda^{q_0}}\ d\lambda\\
=&\ q\cdot(2A_0)^{q_0}\int_0^\infty\lambda^{q-q_0-1}\bigg(\int_X|f_0|^{p_0}\ d\mu\bigg)^{\frac{q_0}{p_0}}\ d\lambda
\end{aligned}
$$
Here I'd like to use the method of duality, similar to the proof of the continuous version of the Minkouski inequality.
$$
\begin{aligned}
\|Tf\|_q^p=&\ \bigg(q\int_0^\infty\lambda^{q-1}\nu(\{x:|Tf(x)|>\lambda\})\ d\lambda\bigg)^{\frac{p}{q}}\\
\leq&\ \bigg(q\int_0^\infty\lambda^{q-1}\nu(\{x:|Tf_0(x)|>\frac{\lambda}{2}\})\ d\lambda\bigg)^{\frac{p}{q}}\\
\leq&\ \bigg(q\int_0^\infty\lambda^{q-1}\frac{(2A_0)^{q_0}\|f_0\|^{q_0}_{p_0}}{\lambda^{q_0}}\ d\lambda\bigg)^{\frac{p}{q}}\\
=&\ \bigg(q\cdot(2A_0)^{q_0}\int_0^\infty\lambda^{q-q_0-1}\bigg(\int_X|f_0|^{p_0}\ d\mu\bigg)^{\frac{q_0}{p_0}}\ d\lambda\bigg)^{\frac{p}{q}}\\
=&\ q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\bigg(\int_0^\infty\lambda^{q-q_0-1}\bigg(\int_X|f_0|^{p_0}\ d\mu\bigg)^{\frac{q_0}{p_0}}\ d\lambda\bigg)^{\frac{p_0}{q_0}}\\
=&\ q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\bigg(\int_0^\infty\bigg(\lambda^{\frac{(q-q_0-1)p_0}{q_0}}\int_X|f_0|^{p_0}\ d\mu\bigg)^{\frac{q_0}{p_0}}\ d\lambda\bigg)^{\frac{p_0}{q_0}}\\
=&\ \sup_{\begin{aligned}g(\lambda)\in L^{1/(1-p_0/q_0)}\\\|g\|_{1/(1-p_0/q_0)}=1\end{aligned}}\bigg\{\bigg|\int_0^\infty g(\lambda)\cdot\lambda^{\frac{(q-q_0-1)p_0}{q_0}}\int_X|f_0|^{p_0}\ d\mu\ d\lambda\bigg|\bigg\}q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\\
=&\ \sup_{\begin{aligned}g(\lambda)\in L^{1/(1-p_0/q_0)}\\\|g\|_{1/(1-p_0/q_0)}=1\end{aligned}}\bigg\{\bigg|\int_0^\infty g(\lambda)\cdot\lambda^{\frac{(q-q_0-1)p_0}{q_0}}\int_{\{x:|f(x)|>C\lambda\}}|f|^{p_0}\ d\mu\ d\lambda\bigg|\bigg\}q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\\
=&\ \sup_{\begin{aligned}g(\lambda)\in L^{1/(1-p_0/q_0)}\\\|g\|_{1/(1-p_0/q_0)}=1\end{aligned}}\bigg\{\bigg|\int_X|f|^{p_0}\int_0^{|f(x)|/C} g(\lambda)\cdot\lambda^{\frac{(q-q_0-1)p_0}{q_0}}\ d\mu\ d\lambda\bigg|\bigg\}q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\\
\leq& \ \sup_{\begin{aligned}g(\lambda)\in L^{1/(1-p_0/q_0)}\\\|g\|_{1/(1-p_0/q_0)}=1\end{aligned}}\bigg\{\bigg|\int_X|f|^{p_0}\bigg(\int_0^{|f(x)|/C} |g(\lambda)|^{1/(1-p_0/q_0)}\ d\lambda\bigg)^{1-\frac{p_0}{q_0}}\\&\cdot \bigg(\int_0^{|f(x)|/C} \lambda^{q-q_0-1}\ d\lambda\bigg)^{\frac{p_0}{q_0}}\ d\mu\bigg|\bigg\}q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\\
\leq&\ \bigg|\int_X|f|^{p_0}\cdot \bigg(\int_0^{|f(x)|/C} \lambda^{q-q_0-1}\ d\lambda\bigg)^{\frac{p_0}{q_0}}\ d\mu\bigg|\ q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\\
=&\ \bigg|\bigg(\frac{1}{(q-q_0)C^{q-q_0}}\bigg)^{\frac{p_0}{q_0}}\cdot\int_X|f(x)|^{\frac{p_0\cdot q}{q_0}}\ d\mu\bigg|\ q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\\
=&\ \bigg|\bigg(\frac{1}{(q-q_0)C^{q-q_0}}\bigg)^{\frac{p_0}{q_0}}\cdot\int_X|f(x)|^{p}\ d\mu\bigg|\ q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\\
=&\ \bigg|\bigg(\frac{1}{(q-q_0)C^{q-q_0}}\bigg)^{\frac{p_0}{q_0}}\bigg|\cdot q^{\frac{p_0}{q_0}}(2A_0)^{p_0}\cdot\|f\|_p^p\\
\end{aligned}
$$
Consequently, we can bound $\|Tf\|_q^q$ using $\|f\|_p^q$, which shows that $T$ is a strong $(p,q)$ operator.
