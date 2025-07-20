import spacy
from textblob import TextBlob
from transformers import pipeline
import re

class DealAnalyzer:
    def __init__(self):
        # Load spaCy model for NER
        self.nlp = spacy.load("en_core_web_sm")
        
        # Initialize sentiment analysis pipeline
        self.sentiment_analyzer = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest")
        
        # Predefined sector keywords
        self.sector_keywords = {
            "Technology": ["tech", "software", "ai", "machine learning", "cloud", "cybersecurity"],
            "Healthcare": ["healthcare", "medical", "pharmaceutical", "biotech", "hospital"],
            "Finance": ["banking", "financial", "insurance", "investment", "fintech"],
            "Energy": ["energy", "oil", "gas", "renewable", "solar", "wind"],
            "Retail": ["retail", "e-commerce", "consumer", "fashion", "food"],
            "Manufacturing": ["manufacturing", "industrial", "automotive", "aerospace"],
            "Real Estate": ["real estate", "property", "construction", "development"]
        }
        
        # Geography keywords
        self.geography_keywords = {
            "North America": ["usa", "united states", "canada", "mexico", "us", "american"],
            "Europe": ["europe", "uk", "germany", "france", "italy", "spain"],
            "Asia": ["asia", "china", "japan", "india", "singapore", "hong kong"],
            "Latin America": ["latin america", "brazil", "argentina", "chile", "mexico"]
        }
    
    def analyze_sentiment(self, text):
        """Analyze sentiment of deal description"""
        try:
            result = self.sentiment_analyzer(text[:512])[0]  # Limit text length
            return {
                "sentiment": result["label"],
                "confidence": result["score"],
                "polarity": self._get_textblob_polarity(text)
            }
        except Exception as e:
            return {"error": str(e)}
    
    def _get_textblob_polarity(self, text):
        """Get TextBlob polarity as backup"""
        blob = TextBlob(text)
        return blob.sentiment.polarity
    
    def extract_entities(self, text):
        """Extract named entities using spaCy"""
        doc = self.nlp(text)
        entities = {
            "organizations": [],
            "people": [],
            "locations": [],
            "money": [],
            "dates": []
        }
        
        for ent in doc.ents:
            if ent.label_ == "ORG":
                entities["organizations"].append(ent.text)
            elif ent.label_ == "PERSON":
                entities["people"].append(ent.text)
            elif ent.label_ == "GPE":
                entities["locations"].append(ent.text)
            elif ent.label_ == "MONEY":
                entities["money"].append(ent.text)
            elif ent.label_ == "DATE":
                entities["dates"].append(ent.text)
        
        return entities
    
    def auto_tag_sector(self, text):
        """Auto-tag deals by sector based on keywords"""
        text_lower = text.lower()
        scores = {}
        
        for sector, keywords in self.sector_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                scores[sector] = score
        
        if scores:
            return max(scores, key=scores.get)
        return "Other"
    
    def auto_tag_geography(self, text):
        """Auto-tag deals by geography"""
        text_lower = text.lower()
        scores = {}
        
        for region, keywords in self.geography_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                scores[region] = score
        
        if scores:
            return max(scores, key=scores.get)
        return "Global"
    
    def comprehensive_analysis(self, text, buyer, target):
        """Run comprehensive AI analysis on a deal"""
        return {
            "sentiment": self.analyze_sentiment(text),
            "entities": self.extract_entities(text),
            "suggested_sector": self.auto_tag_sector(text),
            "suggested_geography": self.auto_tag_geography(text),
            "confidence_score": self._calculate_confidence(text)
        }
    
    def _calculate_confidence(self, text):
        """Calculate confidence score based on text quality"""
        # Simple heuristic: longer, more detailed text = higher confidence
        word_count = len(text.split())
        if word_count > 100:
            return 0.9
        elif word_count > 50:
            return 0.7
        elif word_count > 20:
            return 0.5
        else:
            return 0.3 