import spacy
from spacy.tokens import Span

# Charger le modèle spaCy en anglais
nlp = spacy.load('en_core_web_sm')

# Ajouter des règles personnalisées pour la segmentation
def segment_text(doc):
    segments = []
    start = 0
    include_next = False

    # Liste des mots clés pour la continuation de segment
    continuation_keywords = ['so', 'therefore', 'thus', 'then', 'consequently', 'hence', 'accordingly', 'as a result', 'because', 'as such', 'henceforth', 'henceforward', 'subsequently']

    for token in doc:
        if token.text in ('.', '?', '!', ';') or token.is_space:
            segments.append(doc[start:token.i + 1].text.strip())
            start = token.i + 1
            include_next = False
        elif token.text in continuation_keywords:
            segments.append(doc[start:token.i].text.strip())
            start = token.i
            include_next = True
        elif token.text == ',' and include_next:
            include_next = False

    if start < len(doc):
        segments.append(doc[start:].text.strip())

    return segments



# Exemple de texte
The RGU School of Computing is a great place to study. The staff are Friendly, the labs are state-of-the-art, and the subjects are engaging. So you will have an amazing time during your degree.

doc = nlp(text)

# Segmentation personnalisée du texte
segments = segment_text(doc)

# Afficher les segments
for i, segment in enumerate(segments):
    print(segment)
