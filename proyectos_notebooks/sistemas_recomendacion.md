# Sistemas de Recomendación

```python
import pandas as pd
import numpy as np
```

## Similitud coseno

$$sim(\pmb x, \pmb y) = \frac {\pmb x \cdot \pmb y}{||\pmb x|| \cdot ||\pmb y||}$$

¿Cómo calcularla en Python?

Supongamos que tenemos la siguiente matriz:

|  	| Libro A 	| Libro B 	| Libro C 	|
|-------	|---------	|---------	|---------	|
| Juan 	| 5 	| 4 	| 4 	|
| Diego 	| 4 	| 5 	| 5 	|


Podemos calcular la similitud coseno empleando sklearn:

```python
from sklearn.metrics.pairwise import cosine_similarity
Juan = [5,4,4]
Diego = [4,5,5]
cosine_similarity([Juan, Diego])
```

```text
array([[1.        , 0.97823198],
       [0.97823198, 1.        ]])```

También podemos calcular la similitud a mano:

```python
(5*4 + 4*5 + 4*5)/(np.sqrt(5**2+4**2+4**2)*np.sqrt(4**2+5**2+5**2))
```

```text
0.9782319760890369```

O empleando Numpy

Calcular la similitud coseno usando numpy (con np.dot y np.linalg.norm)

```python
np.dot(Juan,Diego)/np.dot(np.linalg.norm(Juan), np.linalg.norm(Diego))
```

```text
0.9782319760890369```

Ahora bien, cuando tenemos una matriz user-item de la vida real, tenemos muchos casos faltantes. En esta situación, no podremos calcular la similitud coseno tan fácilmente...

```python
user_item = np.array([[5, np.nan, 4],[4,3,5],[4,5,5],[np.nan, 5, np.nan], [np.nan, 5, 3]])
user_item
```

```text
array([[ 5., nan,  4.],
       [ 4.,  3.,  5.],
       [ 4.,  5.,  5.],
       [nan,  5., nan],
       [nan,  5.,  3.]])```

## Surprise

En esta notebook vamos a emplear la librería surprise. Esta es una librería que se basa en la API de scikit-learn y permite implementar varios algoritmos básicos de recomendación.

Comencemos cargando un dataset clásico en sistemas de recomendación: MovieLens (https://movielens.org/). Esta es una página de recomendación de películas que abrió información histórica.

```python
!pip install surprise
# We download the dataset. On Windows you can download it by entering the link manually
!wget https://files.grouplens.org/datasets/movielens/ml-100k/u.data .
```

```text
Collecting surprise
  Downloading surprise-0.1-py2.py3-none-any.whl (1.8 kB)
Collecting scikit-surprise
  Downloading scikit-surprise-1.1.1.tar.gz (11.8 MB)
[K     |████████████████████████████████| 11.8 MB 52 kB/s 
[?25hRequirement already satisfied: joblib>=0.11 in /usr/local/lib/python3.7/dist-packages (from scikit-surprise->surprise) (1.0.1)
Requirement already satisfied: numpy>=1.11.2 in /usr/local/lib/python3.7/dist-packages (from scikit-surprise->surprise) (1.19.5)
Requirement already satisfied: scipy>=1.0.0 in /usr/local/lib/python3.7/dist-packages (from scikit-surprise->surprise) (1.4.1)
Requirement already satisfied: six>=1.10.0 in /usr/local/lib/python3.7/dist-packages (from scikit-surprise->surprise) (1.15.0)
Building wheels for collected packages: scikit-surprise
  Building wheel for scikit-surprise (setup.py) ... [?25l[?25hdone
  Created wheel for scikit-surprise: filename=scikit_surprise-1.1.1-cp37-cp37m-linux_x86_64.whl size=1619404 sha256=d07d43081912b3dceb73b2795cb4568ab4be0734c9e7d6d5e40b3ddb53d61181
  Stored in directory: /root/.cache/pip/wheels/76/44/74/b498c42be47b2406bd27994e16c5188e337c657025ab400c1c
Successfully built scikit-surprise
Installing collected packages: scikit-surprise, surprise
Successfully installed scikit-surprise-1.1.1 surprise-0.1
--2021-09-17 06:11:04--  https://files.grouplens.org/datasets/movielens/ml-100k/u.data
Resolving files.grouplens.org (files.grouplens.org)... 128.101.65.152
Connecting to files.grouplens.org (files.grouplens.org)|128.101.65.152|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1979173 (1.9M)
Saving to: ‘u.data’

u.data              100%[===================>]   1.89M  --.-KB/s    in 0.1s    

2021-09-17 06:11:04 (14.3 MB/s) - ‘u.data’ saved [1979173/1979173]

--2021-09-17 06:11:04--  http://./
Resolving . (.)... failed: No address associated with hostname.
wget: unable to resolve host address ‘.’
FINISHED --2021-09-17 06:11:04--
Total wall clock time: 0.3s
Downloaded: 1 files, 1.9M in 0.1s (14.3 MB/s)
```

```python
import pandas as pd
```

```python
mlens = pd.read_csv("u.data",sep="\t",header=None)
mlens.columns = ["user_id","item_id","rating","timestamp"]
```

```python
mlens = mlens.drop("timestamp", axis=1)
```

El paquete surprise no recibe directamente un objeto DataFrame sino que tiene para parsear y leer un conjunto de datos debe hacerlo a través de dos nuevos objetos: Reader y Dataset. En Reader debemos especificar el valor mínimo y el valor máximo de los ratings y Dataset nos permite leer datos desde distintas fuentes.

```python
from surprise import Dataset, Reader
reader = Reader(rating_scale=(mlens["rating"].min(),mlens["rating"].max()))
```

```python
dataset = Dataset.load_from_df(mlens,reader)
```

```python
dataset
```

```text
<surprise.dataset.DatasetAutoFolds at 0x7fcd9f5030d0>```

Ahora cargue SVD y GridSearchCV, ambos de surprise. Nota: GridSearchCV no está en surprise.GridSearchCV, surprise.GridSearch está deprecado.

```python
from surprise import SVD
from surprise.model_selection import GridSearchCV
```

Genere una grilla de parámetros donde se prueben distintas combinaciones de:  
  - epochs: es la cantidad de pasadas sobre el dataset que hará el algoritmo empleando descenso por el gradiente  
  - biased: usar parámetros de sesgo o no  
  - lr_all: learning rate para todos los parámetros  
  - reg_all: término de regularización para todos los parámetros (lambda)  

```python
param_grid = {'n_epochs': [5, 10], 'lr_all': [0.002, 0.005], 'reg_all': [0.4, 0.6]}
```

Emplee GridSearchCV, SVD y el diccionario con los parámetros para probar, y entrene un modelo. Note que a GridSearchCV necesita pasarle un modelo sin instanciar. Además, setee el parámetro refit a True y con measures = ["rmse","fcp"]

```python
gs = GridSearchCV(SVD, param_grid, measures=['fcp',"rmse"], cv=3, refit=True)
```

```python
gs.fit(dataset)
```

Imprima el rmse y el fcp, y la mejor combinación de parámetros

```python
gs.best_score
```

```text
{'fcp': 0.6986854555890827, 'rmse': 0.9640319718211173}```

```python
gs.best_params
```

```text
{'fcp': {'lr_all': 0.005, 'n_epochs': 10, 'reg_all': 0.4},
 'rmse': {'lr_all': 0.005, 'n_epochs': 10, 'reg_all': 0.4}}```

Guarde el modelo con mayor fcp y prediga el rating para el user id 196 e item id 242

```python
best_model = gs.best_estimator["fcp"]
```

```python
pred = best_model.predict("196", "242")
```

```python
pred.est
```

```text
3.52986```

Pruebe empleando otros modelos como SVDpp, NMF, KNNWithZScore e intente superar el valor obtenido

```python
from surprise import SVDpp
gs = GridSearchCV(SVDpp, param_grid, measures=['fcp',"rmse"], cv=3, refit=True)
gs.fit(dataset)
gs.best_score
```

# Recomendación basada en el contenido

En este ejemplo vamos a tomar un corpus de textos de autores latinoamericanos para sugerir uno similar a uno dado. Para esto construiremos una matriz TFIDF, de frecuencias normalizadas de términos por documento, y usaremos la similitud coseno para medir distancias entre los distintos textos.

```python
!git clone https://github.com/karen-pal/borges
```

```text
Cloning into 'borges'...
remote: Enumerating objects: 211, done.[K
remote: Counting objects: 100% (211/211), done.[K
remote: Compressing objects: 100% (158/158), done.[K
remote: Total 211 (delta 89), reused 171 (delta 49), pack-reused 0[K
Receiving objects: 100% (211/211), 2.21 MiB | 13.08 MiB/s, done.
Resolving deltas: 100% (89/89), done.
```

```python
import pickle
from pathlib import Path
import pandas as pd

df = pd.DataFrame()
# usando el asterisco de "wildcard" traemos todos los archivos en formato pickle
pkls = Path('.').glob('./borges/datasets/*texts.pkl')

# leemos todos los pickles y concatenarlos en un DataFrame
for pkl in pkls:
    with open(pkl, 'rb') as inp:
        df_ = pickle.load(inp)
    df = pd.concat([df, df_])

df.shape
```

```text
(719, 3)```

```python
df.sample(2)
```

```text
                                            link  ...                                               text
2   https://ciudadseva.com/texto/alguien-sonara/  ...  ¿Qué soñará el indescifrable futuro? Soñará qu...
15         https://ciudadseva.com/texto/el-faro/  ...  Lo que hace Genaro es horrible. Se sirve de ar...

[2 rows x 3 columns]```

```python
# We separate the title and author from the metadata into their own columns
df['title'] = df['text_metadata'].apply(lambda x: x['title'])
df['author'] = df['text_metadata'].apply(lambda x: x['author'])
```

```python
# we see the authors available
df['author'].value_counts()
```

```text
Jorge Luis Borges             60
Julio Cortázar                55
Baldomero Lillo               50
Juan José Arreola             45
Augusto Monterroso            45
Alfonso Reyes                 37
Enrique Anderson Imbert       36
Mario Benedetti               33
Julio Ramón Ribeyro           27
Roberto Arlt                  25
Clarice Lispector             25
Julio Torri                   23
Felisberto Hernández          15
Luis Vidales                  14
Adolfo Bioy Casares           13
Rubén Darío                   13
Álvaro Mutis                  11
Edmundo Valadés               10
Juan Rulfo                    10
Juan Rodolfo Wilcock          10
Salarrué                       9
Manuel A. Alonso               9
Elena Garro                    9
Eduardo Gudiño Kieffer         8
Alejo Carpentier               8
Juan Bosch                     8
Virgilio Díaz Grullón          7
Andrés Rivera                  7
Silvina Ocampo                 7
Ricardo Güiraldes              6
Rodolfo Walsh                  6
José Donoso                    5
Manuel Romero de Terreros      5
Pablo Palacio                  5
Gregorio López y Fuentes       4
Julio Garmendia                4
[Cuento - Texto completo.]     4
Rómulo Gallegos                3
Octavio Paz                    3
Rubén Bareiro Saguier          3
José María Arguedas            3
Virgilio Piñera                3
Macedonio Fernández            3
José Edwards                   3
José Lezama Lima               3
Amparo Dávila                  3
Vicente Huidobro               3
María Luisa Bombal             3
Sergio Pitol                   3
Inés Arredondo                 3
Humberto Arenal                2
Teresa de la Parra             2
Leonora Carrington             2
Santiago Dabove                2
Manuel González Zeledón        1
Esteban Echeverría             1
Ricardo Jaimes Freyre          1
Carmen Lyra                    1
Name: author, dtype: int64```

```python
# we remove duplicates and restart the index
df = df.drop_duplicates(subset=[c for c in df.columns if c != 'text_metadata'])
df = df.reset_index(drop=True)
df.shape
```

```text
(693, 5)```

```python
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel
from pprint import pprint
```

Vamos a calcular las matrices de ocurrencias de términos usando sklearn.

Ámbas clases primero construyen el vocabulario total, y luego:  
- **CountVectorizer** nos devuelve la frecuencia absoluta de cada término por cada documento.
- [**TF-IDF**](https://en.wikipedia.org/wiki/Tf%E2%80%93idf): calcula la frecuencia de cada término por documento, y normaliza por el total de documentos donde el término aparece.

$${tf} (t,d)={\frac {f_{t,d}}{\sum _{t'\in d}{f_{t',d}}}}$$

$$
idf( t, D ) = log \frac{ \text{| } D \text{ |} }{ 1 + \text{| } \{ d \in D : t \in d \} \text{ |} }
$$


$$ tfidf( t, d, D ) = tf( t, d ) \times idf( t, D )
$$


```python
# We instantiate the CV
vectorizer = CountVectorizer()

doc1 = 'The word frequency matrix provides information about the content of a document'
doc2 = 'The words that appear in a document are related to its topic'
# We define a list with all the strings
data_corpus = [doc1, doc2]

# We fit the CV and transform the data
X = vectorizer.fit_transform(data_corpus)

# We go from sparse matrix to array using .toarray()

print(X.toarray())
# Using the .get_feature_names() method of the CV we can access the word index
print(vectorizer.get_feature_names())
```

```text
[[0 0 1 2 1 1 0 1 1 1 0 1 1 1 1 0 0 0 0 0 1]
 [1 1 0 0 0 1 1 0 0 0 1 0 0 1 0 1 1 1 1 1 1]]
['aparecen', 'con', 'contenido', 'de', 'del', 'documento', 'en', 'frecuencias', 'información', 'la', 'las', 'matriz', 'otorga', 'palabras', 'por', 'que', 'relaciona', 'se', 'su', 'tema', 'un']
```

```python
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')

stop = list(stopwords.words('spanish'))
# we eliminate "stop words", common non-informative words
tf = TfidfVectorizer(stop_words=stop)
```

```text
[nltk_data] Downloading package stopwords to /root/nltk_data...
[nltk_data]   Unzipping corpora/stopwords.zip.
```

```python
# we calculate the features for each item (text)
tfidf_matrix = tf.fit_transform(df['text'])
```

```python
# we calculate the similarities between all documents
cosine_similarities = linear_kernel(tfidf_matrix, tfidf_matrix)
n = 6

# dictionary created to save the result in a format (author - title: score, title, author)
results = {}
for idx, row in df.iterrows():
    # We save similar indices based on cosine similarity. We order them in ascending order, with 0 being no similarity and 1 being total.
    similar_indices = cosine_similarities[idx].argsort()[:-n-2:-1]
    # we keep the closest N
    similar_items = [(f"{df['author'][i]} - {df['title'][i]}", round(cosine_similarities[idx][i], 3)) for i in similar_indices]
    results[f"{row['author']} - {row['title']}"] = similar_items[1:]
```

```python
pprint(results['Jorge Luis Borges - El Aleph'])
```

```text
[('Jorge Luis Borges - La escritura del dios', 0.144),
 ('Jorge Luis Borges - El inmortal', 0.135),
 ('Jorge Luis Borges - Utopía de un hombre que está cansado', 0.125),
 ('Felisberto Hernández - El acomodador', 0.122),
 ('Clarice Lispector - La búsqueda de la dignidad', 0.121),
 ('Jorge Luis Borges - Funes el memorioso', 0.11)]
```

```python
def recomendar(autor, titulo):
    pprint(results[f"{autor} - {titulo}"])
```

```python
recomendar('Julio Cortázar', 'Axolotl')
```

```text
[('Felisberto Hernández - El acomodador', 0.134),
 ('Felisberto Hernández - El cocodrilo', 0.101),
 ('Felisberto Hernández - Menos Julia', 0.089),
 ('Julio Cortázar - Después del almuerzo', 0.088),
 ('Julio Cortázar - La noche boca arriba', 0.086),
 ('Julio Cortázar - La señorita Cora', 0.086)]
```

