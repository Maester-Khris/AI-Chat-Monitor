# import spacy
# import pickle
# nlp = spacy.load('en_core_web_sm')

# def lemmatize_simple_text(text):
#     st = ""
#     for token in nlp(text):
#         st = st + token.lemma_ + " "
#     return st

# def custom_analyzer(x):
#     return x

# with open('finalized_model.pkl', 'rb') as f:
#     vectorizer, model = pickle.load(f)

# def live_prediction(to_review):
#     filterer = lambda x: ' '.join([token.text for token in nlp(x) if not token.is_stop ])
#     to_review_docs = nlp(to_review)
#     to_review_clean = filterer(to_review_docs.text)
#     to_review_clean_lemma = lemmatize_simple_text(to_review_clean)
#     to_review_features = vectorizer.transform([to_review_clean_lemma])

#     return model.predict(to_review_features)


from ..apps import app_loader

def lemmatize_simple_text(text):
    st = " ".join([token.lemma_ for token in app_loader.nlp(text)])
    return st

def live_prediction(to_review):
    filterer = lambda x: ' '.join([token.text for token in app_loader.nlp(x) if not token.is_stop])
    to_review_docs = app_loader.nlp(to_review)
    to_review_clean = filterer(to_review_docs.text)
    to_review_clean_lemma = lemmatize_simple_text(to_review_clean)
    to_review_features = app_loader.vectorizer.transform([to_review_clean_lemma])

    return True if app_loader.model.predict(to_review_features)[0] == 1 else False 

