from scipy.sparse import csr_matrix
import pandas as pd

def fill_df(beers):
    base_df = pd.read_csv('static/Files/emptyMatrix.csv', index_col ='review_profilename')
    style_df = pd.read_csv('static/Files/convertBeerToStyle.csv')

    beers = [style_df[style_df['beer_name'] == beer]['main_style'].iloc[0] for beer in beers]

    if len(beers) == 3:
        if beers[0]:
            if beers[1]:
                if beers[2]:
                    if beers[0] == beers[1]:
                        if beers[1] == beers[2]:
                            base_df[beers[0]] = 5
                        else:
                            base_df[beers[0]] = 5
                            base_df[beers[2]] = 4.5
                    elif beers[0] == beers[2]:
                        base_df[beers[0]] = 5
                        base_df[beers[1]] = 4.5
                    elif beers[1] == beers[2]:
                        base_df[beers[0]] = 5
                        base_df[beers[1]] = 4.5
                    else:
                        base_df[beers[0]] = 5
                        base_df[beers[1]] = 4.5
                        base_df[beers[2]] = 4
                else:
                    base_df[beers[0]] = 5
                    base_df[beers[1]] = 4.5
            else:
                base_df[beers[0]] = 5
    elif len(beers) == 2:
        if beers[0]:
            if beers[1]:
                    base_df[beers[0]] = 5
                    base_df[beers[1]] = 4.5
            else:
                base_df[beers[0]] = 5
    else:
        if beers[0]:
                base_df[beers[0]] = 5


    base_df = base_df.astype(float)
    sparse_ratings = csr_matrix(pd.SparseDataFrame(base_df).to_coo())
    return sparse_ratings

def queryString(prediction, table):
    prediction = float(prediction)
    query = f"""SELECT * FROM {table} WHERE cluster = {prediction};"""
    return query

def splitSearch(string):
    if string:
        new_string = string.split(' | ')[0]
    else:
        new_string = string
    return new_string

def threeBeers(beers):
    if len(beers) == 3:
        return beers
    elif len(beers) == 2:
        beers.append('null')
        return beers
    else:
        beers.append('null')
        beers.append('null')
        return beers