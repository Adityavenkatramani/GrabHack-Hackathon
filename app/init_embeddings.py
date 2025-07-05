# from langchain_community.document_loaders import PyPDFLoader
# from langchain_community.vectorstores import Chroma
# from langchain_aws import BedrockEmbeddings
# from dotenv import load_dotenv
# import os

# # Load environment variables
# load_dotenv()

# DATA_FILE = "./app/data/payment_faq.pdf"
# CHROMA_DIR = "./app/vector_embeddings"

# # Set up Bedrock Titan V2 embedding model
# embeddings = BedrockEmbeddings(
#     model_id="amazon.titan-embed-text-v2:0",
#     region_name="us-west-2",
#     aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
#     aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
#     aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
# )

# # Load PDF pages as documents
# loader = PyPDFLoader(DATA_FILE)
# docs = loader.load()

# # Create Chroma vectorstore and save it to disk
# vectordb = Chroma.from_documents(docs, embedding=embeddings, persist_directory=CHROMA_DIR)
# vectordb.persist()

# print(f"✅ Embedded {len(docs)} pages from payment_faq.pdf into {CHROMA_DIR}")

import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import SKLearnVectorStore
from langchain_aws import BedrockEmbeddings

def create_and_persist_vectorstore_from_pdf(pdf_path):
    """
    Load a PDF, split it into chunks, create embeddings using AWS Bedrock Titan,
    and persist the vector store to a parquet file.

    Args:
        pdf_path (str): Path to the PDF file
    """
    print(f"Loading PDF from {pdf_path}...")
    
    # Load PDF
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    print(f"Loaded {len(documents)} pages.")

    # Split documents into smaller chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    splits = text_splitter.split_documents(documents)
    print(f"Split into {len(splits)} document chunks.")

    # Set up Bedrock Titan V2 embedding model
    embeddings = BedrockEmbeddings(
        model_id="amazon.titan-embed-text-v2:0",
        region_name="us-west-2",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        aws_session_token=os.getenv("AWS_SESSION_TOKEN"),
    )
    print("Initialized Bedrock Titan Embeddings.")

    # Persist path based on PDF filename
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    persist_dir = os.path.join(os.getcwd(), "vector_embeddings")
    os.makedirs(persist_dir, exist_ok=True)  # ensures the directory exists
    persist_path = os.path.join(persist_dir, f"{base_name}_vectorstore.parquet")

    # Create vector store
    vectorstore = SKLearnVectorStore.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_path=persist_path,
        serializer="parquet",
    )
    print("SKLearnVectorStore created successfully.")

    # Persist to disk
    vectorstore.persist()
    print(f"Embeddings persisted successfully at {persist_path}")

# Example usage
if __name__ == "__main__":
    create_and_persist_vectorstore_from_pdf("data/travel_insurance_sbi.pdf")