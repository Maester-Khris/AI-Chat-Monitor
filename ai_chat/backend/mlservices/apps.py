import os
import importlib
import spacy
import pickle
from django.apps import AppConfig
from django.conf import settings
from .ai_models.methods import custom_analyzer

class CustomUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        try:
            return super().find_class(__name__, name)
        except AttributeError:
            return super().find_class(module, name)

class MlservicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mlservices'
    module= 'mlservices'
    
    # Load ML model and vectorizer once
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.nlp = spacy.load('en_core_web_sm')
        model_path =  os.path.join(settings.BASE_DIR,'mlservices','ai_models','finalized_model.pkl') 
        self.vectorizer, self.model = CustomUnpickler(open(model_path, 'rb')).load()
        


app_loader = MlservicesConfig('mlservices',importlib.import_module("mlservices.apps"))
print('root module has finished loading')



