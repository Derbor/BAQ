from __init__ import init_app

app = init_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8081)