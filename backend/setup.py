from setuptools import setup, find_packages
setup(
    name = "mooch",
    packages = ["mooch"],
    version = "0.0.1",
    description = "Mooch Sentinel Backend",
    author = "Oleksiy Syvokon",
    author_email = "oleksiy.syvokon@gmail.com",
    #url = "",
    #download_url = "",
    keywords = ["mooch sentinel", "progress tracking", "time tracker"],
    install_requires=[
        "flask",
        ],
    classifiers = [
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        ],
    long_description = """\
Mooch Sentinel Backend
-------------------------------------
"""
)
