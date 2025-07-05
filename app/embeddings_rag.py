import os

import pandas as pd
from dotenv import load_dotenv
from langchain_aws import BedrockEmbeddings
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv()

# Bedrock Titan V2 embeddings setup
embeddings = BedrockEmbeddings(
    model_id="amazon.titan-embed-text-v2:0",
    region_name="us-west-2",
    aws_access_key_id=os.getenv("ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("SECRET_ACCESS_KEY"),
    aws_session_token=os.getenv("SESSION_TOKEN"),
)

# Folder containing your 4 .parquet files
VECTOR_DIR = "/home/varun/projects/GrabHack-Hackathon/vector_embeddings"

# List of .parquet files
VECTORSTORES = [
    "payment_faq_vectorstore.parquet",
    "travel_cover_vectorstore.parquet",
    "travel_insurance_sbi_vectorstore.parquet",
    "ride-cover-personal-accident_vectorstore.parquet",
]

# Load all parquet files into a dictionary of DataFrames
vector_dbs = {}
for file in VECTORSTORES:
    path = os.path.join(VECTOR_DIR, file)
    vector_dbs[file] = pd.read_parquet(path)


# Function to compute similarity between two vectors
def similarity(a, b):
    return cosine_similarity([a], [b])[0][0]


# Unified search function over all .parquet vectorstores
def search_faq(query: str) -> str:
    query_embedding = embeddings.embed_query(query)

    best_score = -1
    best_text = None
    best_source = None

    for store_name, df in vector_dbs.items():
        # Assumes your parquet has 'embedding' and 'content' columns
        for _, row in df.iterrows():
            score = similarity(query_embedding, row["embeddings"])
            if score > best_score:
                best_score = score
                best_text = row["texts"]
                best_source = store_name

    if best_text:
        return f"[{best_source}] {best_text}"
    else:
        return "Sorry, no relevant FAQ found."
