from flask import Flask,jsonify,request
import cv2
import numpy as np
from sklearn.cluster import KMeans
import imutils
from flask_cors import CORS,cross_origin
import os

app=Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def bgr_to_hex(bgr):
    return '#{:02x}{:02x}{:02x}'.format(bgr[2],bgr[1],bgr[0])

@app.route('/')
@cross_origin()
def home():
    return "Welcome to the PixelPalette REST API!"

@app.route('/api/generate-palette',methods=['POST'])
@cross_origin()
def generate_palette():
    if 'image' not in request.files:
        return jsonify({'error':'Missing image'}),400
    elif 'numColours' not in request.form:
        return jsonify({'error':'Missing number'}),400
    
    file=request.files['image']
    num=int(request.form['numColours'])

    if not file:
        return jsonify({'error':'No file received'}),400
    
    temp_file_path='temp_image.jpg'
    file.save(temp_file_path)
    
    img=cv2.imread(temp_file_path)

    if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

    clusters=num
    #Resize image
    img=imutils.resize(img,height=200)
    flat_img=np.reshape(img,(-1,3))

    #Get the dominant colours using k-Means
    kmeans=KMeans(n_clusters=clusters,random_state=0)
    kmeans.fit(flat_img)
    dominant_colors=np.array(kmeans.cluster_centers_,dtype='uint')

    #Find out relative percentages of colours and sort
    percentages=(np.unique(kmeans.labels_, return_counts=True)[1])/flat_img.shape[0]
    p_and_c=zip(percentages,dominant_colors)
    p_and_c=sorted(p_and_c,reverse=True)

    color_data=[]
    for percentage,color in p_and_c:
        bgr=color.tolist()
        hex=bgr_to_hex(color)
        color_info={
            'percentage':round(percentage*100,2),
            'bgr':bgr,
            'hex':hex,
        }
        color_data.append(color_info)

    return jsonify(color_data)

if __name__=='__main__':
    app.run(debug=True)
