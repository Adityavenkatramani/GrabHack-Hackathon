import pandas as pd
import glob
import os

VECTOR_DIR = "./"  # current folder, or change path if needed
parquet_files = glob.glob(os.path.join(VECTOR_DIR, "*.parquet"))

for file in parquet_files:
    df = pd.read_parquet(file)
    print(f"{os.path.basename(file)} columns: {df.columns.tolist()}")